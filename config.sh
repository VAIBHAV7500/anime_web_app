echo "Getting Configs"
cd ../animei_config
echo "Setting Permissions"
git remote set-url origin git@github.com:animei-tv/animei_config.git
echo "Stashing previous changes"
git stash
echo "Fetching"
git fetch
echo "Pulling"
git pull
echo "Removing existing configs..."
rm -rf ../anime_web_app/backend/config
echo "Copying data to anime_web_app"
cp -R ./anime_web_app/config ../anime_web_app/backend/
