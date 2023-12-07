// Adapted from https://stackoverflow.com/a/74671723

#include <fstream>
#include <vector>
#include <iomanip>
#include <sstream>
#include <openssl/evp.h>
#include <openssl/sha.h>

auto sha256 = [](std::string fname,
	std::vector<unsigned char>& hash) -> bool
	{
		std::unique_ptr<EVP_MD_CTX, void (*)(EVP_MD_CTX*)>
			evpCtx(EVP_MD_CTX_new(), EVP_MD_CTX_free);
		EVP_DigestInit_ex(evpCtx.get(), EVP_sha256(), nullptr);

		constexpr size_t buffer_size{ 1 << 12 };
		std::vector<char> buffer(buffer_size, '\0');

		std::ifstream fp(fname, std::ios::binary);
		if (!fp.is_open())
		{
			printf("File not found: %s", fname);
			return false;
		}
		while (fp.good())
		{
			fp.read(buffer.data(), buffer_size);
			EVP_DigestUpdate(evpCtx.get(), buffer.data(), fp.gcount());
		}
		fp.close();

		hash.resize(SHA256_DIGEST_LENGTH);
		std::fill(hash.begin(), hash.end(), 0);
		unsigned int len;
		EVP_DigestFinal_ex(evpCtx.get(), hash.data(), &len);

		return true;
	};

int main(int argc, char* argv[])
{
	if (argc < 2) {
		printf("Usage: %s <file>", argv[0]);
	}
	else {
		std::vector<unsigned char> hash;
		sha256(argv[1], hash);
		std::stringstream out;
		for (size_t i = 0; i < hash.size(); i++)
			out << std::setfill('0') << std::setw(2)
			<< std::hex << int(hash[i]);
		std::string hashStr = out.str();
		printf(hashStr.c_str());
	}
}