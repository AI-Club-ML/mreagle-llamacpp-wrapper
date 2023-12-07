# check_avx

ok this is a really really tiny project so ill keep readme really simple.

for windows only

### why did i make this?

i needed to check if the current machine's CPU instruction set to make sure it supports AVX2. llama.cpp has different executables for CPUs that support AVX2 and CPUs that dont support AVX2 (uses AVX instead).

i needed to check it before actually running the llama.cpp executable (i could check to see if the execution failed, but thats a waste of time) and there was no other easier way than this... so c++ it is!

also c++ is really light-weight, produces an exe of only 16KB

## 🔨 Building

1. compile in VS2022
2. output exe can be found at `./out/build/x64-release/checkavx.exe`
3. you have exe, do whatever you want with it ig
4. copy it to `../../bin/` to use in electron app
