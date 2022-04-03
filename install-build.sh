cd frontend
rm -rf build || true
npm ci
npm run build
rm -rf ../backend/build || true
cp -R build ../backend/
