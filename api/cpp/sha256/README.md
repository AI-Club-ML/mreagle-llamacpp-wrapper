# check_avx

ok this is a really really tiny project so ill keep readme really simple.

for windows only

### why did i make this?

i needed to hash files and get its SHA256 so I can verify the file integrity of model files. Nodejs doesn't like files larger than 2GB.

there was no other easier way than this... so c++ it is!

also c++ is really light-weight, produces an exe of only 172KB

## 🔨 Building

1. compile in VS2022
2. output exe can be found at `./out/build/x64-release/sha256.exe`
3. you have exe, do whatever you want with it ig
4. copy it to `../../bin/` to use in electron app
