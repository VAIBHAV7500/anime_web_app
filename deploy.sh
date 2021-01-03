echo "Setting Permissions"
git remote set-url origin git@github.com:VAIBHAV7500/anime_web_app.git
echo "Pulling repository"
git status
echo "Stashing Current Changes"
git stash
echo "Fetching Data"
git fetch 
echo "Pulling Data" 
git pull 

cd frontend
echo "Installing Frontend Packages"
npm install 
cd ../backend
echo "Installing Backend Packages"
npm install 
echo "Creating Tables & Mirgartions"
npm run db
echo "Building Frontend"
cd ..
sh build.sh
echo "Stopping Server"
forever stopall || true
echo "Updating Config"
sh config.sh 
echo "Creating Server"
forever start ./backend/app.js
