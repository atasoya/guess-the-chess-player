import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import re
import json
import base64
import os

def scrape_fide_ratings():
    url = "https://ratings.fide.com/a_top.php?list=open"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            player_links = []
            for a_tag in soup.find_all('a', href=True):
                if 'profile/' in a_tag['href']:
                    link_info = {
                        'name': a_tag.text.strip(),
                        'profile_url': a_tag['href']
                    }
                    if not link_info['profile_url'].startswith(('http://', 'https://')):
                        base_url = "https://ratings.fide.com/"
                        if link_info['profile_url'].startswith('/'):
                            link_info['profile_url'] = base_url + link_info['profile_url'][1:]
                        else:
                            link_info['profile_url'] = base_url + link_info['profile_url']
                    if link_info not in player_links:
                        player_links.append(link_info)

            print(f"Found {len(player_links)} player profiles on the page.")
            return player_links
        else:
            print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None

def scrape_player_profile(profile_url, player_name, rank):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    player_data = {
        "Rank": rank,
        "ID": None,
        "Gender": None,
        "label": player_name,
        "elo": None,  # Standard rating
        "born": None,
        "nationality": None,
        "title": None,
        "rapid": None,  # Add rapid rating
        "blitz": None   # Add blitz rating
    }

    image_data = {
        "ID": None,
        "src": None
    }

    try:
        response = requests.get(profile_url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract FIDE ID from URL as fallback
            fide_id_match = re.search(r'profile/(\d+)', profile_url)
            if fide_id_match:
                player_data["ID"] = int(fide_id_match.group(1))
                image_data["ID"] = int(fide_id_match.group(1))

            # Extract ratings from profile-games section
            games_div = soup.find('div', class_='profile-games')
            if games_div:
                # Standard rating
                standard_div = games_div.find('div', class_='profile-standart')
                if standard_div:
                    standard_rating = standard_div.find('p').text.strip()
                    player_data["elo"] = int(standard_rating)

                # Rapid rating
                rapid_div = games_div.find('div', class_='profile-rapid')
                if rapid_div:
                    rapid_rating = rapid_div.find('p').text.strip()
                    player_data["rapid"] = int(rapid_rating)

                # Blitz rating
                blitz_div = games_div.find('div', class_='profile-blitz')
                if blitz_div:
                    blitz_rating = blitz_div.find('p').text.strip()
                    player_data["blitz"] = int(blitz_rating)

            # Extract personal info from profile-info section
            info_div = soup.find('div', class_='profile-info')
            if info_div:
                # FIDE ID
                id_tag = info_div.find('p', class_='profile-info-id')
                if id_tag:
                    player_data["ID"] = int(id_tag.text.strip())

                # Federation (Nationality)
                country_div = info_div.find('div', class_='profile-info-country')
                if country_div:
                    nationality = country_div.text.strip().split()[-1]  # Extract country name (e.g., "Norway")
                    player_data["nationality"] = nationality

                # Birth Year
                byear_tag = info_div.find('p', class_='profile-info-byear')
                if byear_tag:
                    player_data["born"] = int(byear_tag.text.strip())

                # Gender
                sex_tag = info_div.find('p', class_='profile-info-sex')
                if sex_tag:
                    player_data["Gender"] = sex_tag.text.strip()

                # Title
                title_tag = info_div.find('div', class_='profile-info-title')
                if title_tag:
                    title_text = title_tag.find('p').text.strip()
                    player_data["title"] = "GM" if title_text == "Grandmaster" else title_text

            # Extract the 16th image tag src (or adjust as needed)
            img_tags = soup.find_all('img')
            if len(img_tags) >= 16:
                image_src = img_tags[15]['src']
                print(f"Raw src for {player_name}: {image_src}")  # Debug print
                if image_src.startswith('data:image/jpeg;base64,'):
                    image_data["src"] = image_src
                elif image_src.startswith('https://ratings.fide.com/data:image/jpeg;base64,'):
                    image_data["src"] = image_src.replace('https://ratings.fide.com/', '')
                elif not image_src.startswith(('http://', 'https://')):
                    base_url = "https://ratings.fide.com/"
                    image_data["src"] = base_url + image_src.lstrip('/')
                else:
                    image_data["src"] = image_src
            else:
                print(f"Less than 16 images found on profile page for {player_name}")
                # Try the first image as a fallback (often the player photo)
                img_tag = soup.find('img')
                if img_tag and 'src' in img_tag.attrs:
                    image_src = img_tag['src']
                    print(f"Fallback src for {player_name}: {image_src}")
                    if not image_src.startswith(('http://', 'https://')):
                        base_url = "https://ratings.fide.com/"
                        image_data["src"] = base_url + image_src.lstrip('/')
                    else:
                        image_data["src"] = image_src
                else:
                    image_data["src"] = None

            return player_data, image_data
        else:
            print(f"Failed to retrieve profile page for {player_name}. Status code: {response.status_code}")
            return None, None
    except Exception as e:
        print(f"An error occurred while scraping {player_name}: {str(e)}")
        return None, None

def save_images(images_data, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    for image_data in images_data:
        player_id = image_data['ID']
        src = image_data['src']

        if player_id is None or src is None:
            print(f"Skipping entry with missing ID or src: {image_data}")
            continue

        output_file = os.path.join(output_dir, f"{player_id}.jpeg")

        if src.startswith('data:image/jpeg;base64,'):
            try:
                base64_string = src.split(',')[1]
                image_bytes = base64.b64decode(base64_string)
                with open(output_file, 'wb') as f:
                    f.write(image_bytes)
                print(f"Saved Base64 image to {output_file}")
            except Exception as e:
                print(f"Error decoding Base64 for ID {player_id}: {str(e)}")
        elif src.startswith('http://') or src.startswith('https://'):
            try:
                response = requests.get(src, headers=headers, stream=True)
                if response.status_code == 200:
                    with open(output_file, 'wb') as f:
                        f.write(response.content)
                    print(f"Downloaded and saved URL image to {output_file}")
                else:
                    print(f"Failed to download image for ID {player_id}: Status {response.status_code}")
            except Exception as e:
                print(f"Error downloading image for ID {player_id}: {str(e)}")
        else:
            print(f"Skipping invalid src for ID {player_id}: {src}")

if __name__ == "__main__":
    player_links = scrape_fide_ratings()

    if player_links:
        all_players_data = []
        all_images_data = []

        num_players_to_scrape = min(100, len(player_links))
        print(f"\nScraping profiles for {num_players_to_scrape} players...")

        for i, player in enumerate(player_links[:num_players_to_scrape], 1):
            print(f"Processing {i}/{num_players_to_scrape}: {player['name']}")
            player_data, image_data = scrape_player_profile(player['profile_url'], player['name'], i)
            if player_data and image_data:
                all_players_data.append(player_data)
                all_images_data.append(image_data)
            time.sleep(1)

        # Save to JSON files
        with open('../src/app/data/chessPlayers.json', 'w', encoding='utf-8') as f:
            json.dump(all_players_data, f, indent=4)
        print("\nPlayer data saved to 'chessPlayers.json'")

        with open('images.json', 'w', encoding='utf-8') as f:
            json.dump(all_images_data, f, indent=4)
        print("Image data saved to 'images.json'")

        # Save images as JPEGs
        output_dir = '../public/players'
        save_images(all_images_data, output_dir)


