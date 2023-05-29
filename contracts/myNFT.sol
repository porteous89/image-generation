// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyAvatar is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping (uint256 => string) private _tokenURIs;

    constructor() ERC721("MyAvatar", "MAV") {}

    function mintAvatar(address recipient, string memory metadataURI) 
        public onlyOwner returns (uint256)
    {
        _tokenIdCounter.increment();
        uint256 newAvatarId = _tokenIdCounter.current();
        _mint(recipient, newAvatarId);
        _setTokenURI(newAvatarId, metadataURI);
        return newAvatarId;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}