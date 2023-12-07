# CMakeList.txt : CMake project for sha256, include source and define
# project specific logic here.
#
cmake_minimum_required (VERSION 3.8)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

project ("sha256")

# Add source to this project's executable.
add_executable (sha256 "sha256.cpp")

if (CMAKE_VERSION VERSION_GREATER 3.12)
  set_property(TARGET sha256 PROPERTY CXX_STANDARD 20)
endif()

# Add openSSL
find_package(OpenSSL REQUIRED)
target_link_libraries(
    sha256 OpenSSL::SSL
)
target_link_libraries(sha256 OpenSSL::Crypto)