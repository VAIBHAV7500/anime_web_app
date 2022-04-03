cd frontend
rm -rf build || true
npm run ci
npm run build
rm -rf ../backend/build || true
cp -R build ../backend/
