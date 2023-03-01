// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/math/Math.sol";


abstract contract BlackList is Ownable {



    mapping (address => bool) public isBlackListed;

    function addBlackList (address _evilUser) public onlyOwner {
        isBlackListed[_evilUser] = true;
        emit AddedBlackList(_evilUser);
    }

    function removeBlackList (address _clearedUser) public onlyOwner {
        isBlackListed[_clearedUser] = false;
        emit RemovedBlackList(_clearedUser);
    }

    event AddedBlackList(address indexed _user);

    event RemovedBlackList(address indexed _user);

}

abstract contract WhiteList is Ownable {

    bool public isOpenSell = false;
    mapping (address => bool) public isWhiteListed;

    function setOpenSell(bool _isOpenSell) public onlyOwner {
        isOpenSell = _isOpenSell;
    }

    function addWhiteList (address _evilUser) public onlyOwner {
        isWhiteListed[_evilUser] = true;
        emit AddedWhiteList(_evilUser);
    }

    function removeWhiteList (address _clearedUser) public onlyOwner {
        isWhiteListed[_clearedUser] = false;
        emit RemovedWhiteList(_clearedUser);
    }

    event AddedWhiteList(address indexed _user);

    event RemovedWhiteList(address indexed _user);

}

abstract contract PancakePairsList is Ownable {

    mapping(address => bool) public isPancakePairs;

    
    function addPancakePairsList (address _address) public onlyOwner {
        isPancakePairs[_address] = true;
        emit AddedPancakePairsList(_address);
    }

    function removePancakePairsList (address _address) public onlyOwner {
        isPancakePairs[_address] = false;
        emit RemovedPancakePairsList(_address);
    }

    event AddedPancakePairsList(address indexed _address);

    event RemovedPancakePairsList(address indexed _address);

}

/**
 * @dev {ERC20} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract BasicToken is Context, AccessControlEnumerable, ERC20Burnable, ERC20Pausable,Ownable,BlackList,WhiteList,PancakePairsList {


    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");


    
    

    // using Math for uint256;

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE` and `PAUSER_ROLE` to the
     * account that deploys the contract.
     *
     * See {ERC20-constructor}.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());
        
        _mint(address(this), 100000000000*(10**decimals()));
        
        _transfer(address(this),0x6BF4397634C5BfD03CB37c0B0b9f1053d2c905e7, 10000000*(10**decimals()));
        _transfer(address(this),0x2A5eA6Cc864251b20B63239e28783206b8C7eE95, 10000000*(10**decimals()));
        _transfer(address(this),0xbe7c760D1F4447866473453EDBaB510FE3024971, 10000000*(10**decimals()));
        _transfer(address(this),0x7Ff4e0c255F81a97Fcc4EA78183Eb5cFD2A1e644, 10000000*(10**decimals()));
        _transfer(address(this),0x7e7141a68002Ea5b643900B1666A7FEf23A32e4D, 10000000*(10**decimals()));
        _transfer(address(this),0xEe6E32f55a001E1f3550866542905f31A136B39A, 10000000*(10**decimals()));
        _transfer(address(this),0x402eBCcADeC232b872c14AEDDd7844Ffee3527e8, 10000000*(10**decimals()));
        _transfer(address(this),0xe057b8e30D6f0b2800DCe40452Edb44EF5D8C0C2, 10000000*(10**decimals()));
        _transfer(address(this),0x93fFC47FE7328CEd7900D56596408Bc44968EE04, 10000000*(10**decimals()));
        _transfer(address(this),0xCa2D729D222679BB396b7B39Eb194539c8365371, 10000000*(10**decimals()));
        _transfer(address(this),0x6ccf10Ae1C416B554C5310094B9A35e144A8E59E, 10000000*(10**decimals()));
        _transfer(address(this),0xE59A634A9F6aF58239f452857c8B8E933098357c, 10000000*(10**decimals()));
        _transfer(address(this),0x5d445280b5120c6E48d1AFe45F7807341A7b4Ad1, 10000000*(10**decimals()));
        _transfer(address(this),0x7Fbb0BAC43A9155cE6d982b759B224DB0Be8d6ab, 10000000*(10**decimals()));
        _transfer(address(this),0x66929F124fBD64cbc3dF5E994014eb43C09bdF23, 10000000*(10**decimals()));
        _transfer(address(this),0x0492fDB0F35B40a225F6E3fa24876f434F4cF988, 10000000*(10**decimals()));
        _transfer(address(this),0x92f3B078fF55fA194A372F73446302cD05df55cB, 10000000*(10**decimals()));
        _transfer(address(this),0x73021fa6e3Eaf7CAb67661ff6F7FEd47CB8b2DD2, 10000000*(10**decimals()));
        _transfer(address(this),0x10EA6936581fBA0CaDe2eC8f863471C0b4B19Ac4, 10000000*(10**decimals()));
        _transfer(address(this),0x4C533DE70d875A822513797C5f1FFc95e18d3C7a, 10000000*(10**decimals()));
        _transfer(address(this),0x5b5b760f5616f6810B3D7Da6Fa18DcF598057b2C, 10000000*(10**decimals()));
        _transfer(address(this),0xe4fa7BCF3eEf5fF2AFc52d312b55086D138d694B, 10000000*(10**decimals()));
        _transfer(address(this),0xb131471033F6bAb0b89e1caea5190C2383571E51, 10000000*(10**decimals()));
        _transfer(address(this),0xbe7c760D1F4447866473453EDBaB510FE3024971, 10000000*(10**decimals()));
        _transfer(address(this),0x2c24AFe669A451B2388DbDE135Be496c81faEF10, 10000000*(10**decimals()));
        _transfer(address(this),0xF1AdA1c9AeA9eFc60b90e34b1fF0bbD4Ac5b536a, 10000000*(10**decimals()));
        _transfer(address(this),0x3812E94831412A645F4bD192e68A842611F95836, 10000000*(10**decimals()));
        _transfer(address(this),0x004D3eDE0fE21d1a779a2e4ABE62F47D0659Eac5, 10000000*(10**decimals()));
        _transfer(address(this),0xA7a92d092901a65ed605cEEabE898d8197aC9fD1, 10000000*(10**decimals()));
        _transfer(address(this),0xFC7372698eaCa285662E3dDA3a30DD5b0A91F2ec, 10000000*(10**decimals()));
        _transfer(address(this),0xc708Db4525985055FF58cA23537Eb83ddf16c004, 10000000*(10**decimals()));
        _transfer(address(this),0x9d80306883D3215d8D503DF500f7609d49879430, 10000000*(10**decimals()));
        _transfer(address(this),0x90CE6eAFe2E261415Df63d62FC76ad6Fe415FC95, 10000000*(10**decimals()));
        _transfer(address(this),0xFB911fEfD38d841b632C5d6ac4acB6205c33e489, 10000000*(10**decimals()));
        _transfer(address(this),0x3ce347a07db9Dd166e4cEA02baBB2C6D45730AfA, 10000000*(10**decimals()));
        _transfer(address(this),0x378A14ebbd3342184bB5a4Fb226FCCbc2298a0C4, 10000000*(10**decimals()));
        _transfer(address(this),0xf0FC0841573A8a7079a0bC6C4379d6C7F00eA651, 10000000*(10**decimals()));
        _transfer(address(this),0x6D7080b232EC29790f54a134aF64D20C1E932751, 10000000*(10**decimals()));
        _transfer(address(this),0x7616735C6f2e1cD8916e89d70de455FFC5174422, 10000000*(10**decimals()));
        _transfer(address(this),0xe79Ec0EBB86Ff9CCf45B545a11769C923f947d54, 10000000*(10**decimals()));
        _transfer(address(this),0xd41030a3817A4B248Ce4DD03F511c2CEf8F58f06, 10000000*(10**decimals()));
        _transfer(address(this),0xd5293dC9f237E7C11a87D9dad1a78010DE72EAb6, 10000000*(10**decimals()));
        _transfer(address(this),0xae18386f62a14DB7162802481Bb590432345Fe0D, 10000000*(10**decimals()));
        _transfer(address(this),0xA645F8e5040155045248B56EfeA77208689E0f7c, 10000000*(10**decimals()));
        _transfer(address(this),0xEC1156BB60381054cc6Bb5c91F5Fa9bdA9bE1223, 10000000*(10**decimals()));
        _transfer(address(this),0x379323A365f78A11770880370368EfEEa9B64563, 10000000*(10**decimals()));
        _transfer(address(this),0xa2fbE309955Afca0c8903D8ccB4C718cB4380076, 10000000*(10**decimals()));
        _transfer(address(this),0x32Ea01A3a288a43d21929524aF927Fa34fd0657F, 10000000*(10**decimals()));
        _transfer(address(this),0xdd4c7a48f7e4ACD62CfE26d4eA2D9fB9cf2BFC00, 10000000*(10**decimals()));

        _transfer(address(this),0xd23943A570Fb8Ab607A138DC326a362B1b2240dD, 500000*(10**decimals()));
        _transfer(address(this),0x903e1e39046847Ac64fC569063D6606CCEAb9ce5, 500000*(10**decimals()));
        _transfer(address(this),0xad59754517C74D246fcB4ff0816a50fa26744218, 500000*(10**decimals()));
        _transfer(address(this),0x0595fe6C7f39ee2ec6c3bc8bcE086d2cA7A47ef8, 500000*(10**decimals()));
        _transfer(address(this),0x0f4AEfa2c91FDF660dD987100b50C5Ae0CaA3b4e, 500000*(10**decimals()));
        _transfer(address(this),0x48cA95065F0872133063518cCbcC00DeAfaDe3e6, 500000*(10**decimals()));
        _transfer(address(this),0xa601b6C1a9F327451e42034dF66FBd59aA0F740F, 500000*(10**decimals()));
        _transfer(address(this),0x2C9392b6B9c7b2aD39c24Ba1c31FFCF9e2dC4c6b, 500000*(10**decimals()));
        _transfer(address(this),0xF2cB38dCd75801647AAeB25F9F25C5164f53fD2F, 500000*(10**decimals()));
        _transfer(address(this),0x387335e14C10fEF872C85BbeA45a9ABf72980659, 500000*(10**decimals()));

        _transfer(address(this),0x576948ed90498aA00A31B32d45227F58330799d5, 1000000*(10**decimals()));

        if(balanceOf(address(this)) > 0){
            _transfer(address(this),_msgSender(),balanceOf(address(this)));
        }
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(address to, uint256 amount) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC20: must have minter role to mint");
        _mint(to, amount);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC20: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC20Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual {
        require(hasRole(PAUSER_ROLE, _msgSender()), "ERC20: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);

        require(!isBlackListed[from],"ERC20: must not be black to transfer");

        if(from == address(0) || to == address(0)){
            return;
        }

        if(from == owner() || to == owner()){
            return;
        }
        
        //not open sell and is sell
        if(!isOpenSell && isPancakePairs[to]){
            require(isWhiteListed[from],"ERC20: sell is close");
        }
        
        if(!isPancakePairs[from] && !isPancakePairs[to]){
            require(isWhiteListed[from] || (!isWhiteListed[from] && !isWhiteListed[to]),"ERC20: Ordinary addresses cannot be transferred to the whitelist");
        }
    }
}

interface IPancakeFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

