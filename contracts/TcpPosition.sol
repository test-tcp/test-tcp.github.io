// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


contract TcpPosition  is Context,Ownable{
    using Address for address;
	using SafeMath for uint256;
	using SafeERC20 for IERC20;

    event LockPosition(address indexed _from,  uint256 _value);
    event Harvest(address indexed _from,  uint256 _value);
    event HarvestUnlockAmount(address indexed _from,  uint256 _value);
    event LevelUp(address indexed _to,  uint256 _value);
    event LevelReward(address indexed _from,address indexed _to, uint256 _value);
    event RecommendReward(address indexed _from,address indexed _to, uint256 _value);
    bool private isRelock = false;
    //
    modifier modRelock() {
        isRelock = true;
        _;
        isRelock = false;
    }
    //Maker Rating
    modifier levelUp(address sender) {
        uint256 preLockAmount = userInfos[sender].lockAmount;
        _;
        if(preLockAmount < _levelOneLockAmount && userInfos[sender].lockAmount >= _levelOneLockAmount){
            
            address cur = sender;
            for (uint256 i = 0; i < _assessLevel.length; i++) {
                uint256 assess = _assessLevel[i];
                if(assess == 0){
                    break;
                }
                cur = getParentAddress(cur);
                if(cur == address(0)){
                    break;
                }
                userInfos[cur].levelRecommendNum[i]+=1;
                
                if(userInfos[cur].level > i){
                    break;
                }
                if(userInfos[cur].levelRecommendNum[i] < assess){
                    break;
                }
                userInfos[cur].level = i+1;
                emit LevelUp(cur,userInfos[cur].level);
            }
        }
    }
    
    DataToChain public  _dataToChain;

    IERC20 public  _token;

    
    struct UserInfo {
        address parentAddress;
        uint256 harvestTime;
        uint256 lockAmount;
        mapping(uint256 => uint256) unlockTimeAndAmount;

        uint256 [] unlockTimeAndAmountKeys;
        uint256 harvestAmount;
        uint256 recommendReward;
        address[] recommendAccounts;

        mapping(address => uint256) sonRecommendReward;

        mapping(uint256 => uint256) levelRecommendNum;

        uint256 level;
        uint256 levelReward;
    }

    mapping(address => UserInfo) public userInfos;

    mapping(address => address) public replaceFromAddress;

    mapping(address => address) public replaceToAddress;

    uint256 constant public decimalsUnit = 10**18;
    uint256 public constant _cycleTime = 730 days;

    uint256 private constant _migrationTime = 1644940800;


    uint256 private constant _migrationEndTime = _migrationTime+_cycleTime;

    uint256 public  _halveTime = 1651766400;

    uint256 public immutable _secondsRate = decimalsUnit/_cycleTime;
    
    uint256[] public inviteRate = [10,6,5,4,3,2,1,1,1,1];

    uint256 public _harvestFee = 20;

    uint256[] public _assessLevel = [2,3,3,3,3];

    uint256[] public _levelRates = [1,2,3,4,5];

    uint256 public _levelOneLockAmount = 200_000*decimalsUnit;

    mapping(address => bool) public _isMiner;

    address public defaultParent = 0x207F90447e00CcCeFf3bB956e8EAeC3A43EdfF21;

    receive() external payable {
		
	}


    constructor(address dataToChainAddress,IERC20 token) {
        require(dataToChainAddress.isContract(),"TcpPosition:dataToChainAddress is not contract");
        _dataToChain = DataToChain(dataToChainAddress);
        _token = token;
        setMiner(_msgSender(), true);
        init();
    }
    function init() public  onlyOwner{
        //one
        setReplaceAddress(0x5B12a40a0Dfb905B456e11B849d8085b4a538323,0xef1b2eA006fF1962fBaACFF5A3B323B0375048C0);
        setReplaceAddress(0x1C3e8bCC873DAC4207411A39783189865B7fB525,0x4AdF9B4403C66f6DD95f229F5085cC661c4cE6A4);
        setReplaceAddress(0x562A5f49FA0d74fCAa97Fe1dB934bBCB4A23eEb6,0x7B85Ed41333bEfEc9a3d1A7C7FDeB1D563DD19c6);
        setReplaceAddress(0xe78e62D1ef3d30a84e0635B0E47E257955EE0547,0x9D7915c35F30C0e119511E716CEe193dd3f262A4);
        setReplaceAddress(0xAA27520e5f06f2D7B8262125B52aC48eb0D57141,0x6208b4233b08b50CE743f638bcF0A7041D1F77B0);
        setReplaceAddress(0x77922c6F110fD67580ccDb0D6562aA45Fc853444,0xDD095762C7Eafb40A94c3823187353050cE61762);
        // setReplaceAddress(0x75B0514317A85f324B8011499F01546973065551,0x2E148A0C71e45269fDa72220069F22eC9770d974);
        setReplaceAddress(0xD9C14DE3F917075705e18b8a1F3317D9F7B4CA49,0x8a4DcD05B5F7910039C259b55e7CAfAe5eAA197b);
        //two
        setReplaceAddress(0xa0F784FC2842Edb17D1B242C8Ee36c472E79b5F1,0xf7b310BdAbDa7fcEbA84985a1eC184fbCb7bE4D1);
        setReplaceAddress(0x65e60EF1E494cD2769ee0c50e23EEed5C84B93d7,0x98d2eE46D77faeB7C281a1ae0f42aaDCa17E217d);
        setReplaceAddress(0x7927AE0737Ee178EcF773D4663737522a56c2A76,0xDacfc36E744F96765ABffc5301912DA72721B200);
        setReplaceAddress(0xbCbD7D06b08efe84F8e4ae98d608A3b3E0Cc8217,0xE296c1A93eF6DD017F9a6DC206A8711129756800);
        setReplaceAddress(0xa0F784FC2842Edb17D1B242C8Ee36c472E79b5F1,0xf7b310BdAbDa7fcEbA84985a1eC184fbCb7bE4D1);
        setReplaceAddress(0x65e60EF1E494cD2769ee0c50e23EEed5C84B93d7,0x98d2eE46D77faeB7C281a1ae0f42aaDCa17E217d);
        setReplaceAddress(0x7927AE0737Ee178EcF773D4663737522a56c2A76,0xDacfc36E744F96765ABffc5301912DA72721B200);
        setReplaceAddress(0xbCbD7D06b08efe84F8e4ae98d608A3b3E0Cc8217,0xE296c1A93eF6DD017F9a6DC206A8711129756800);
        setReplaceAddress(0x35bfDF28498D5bcac55eD260259Aeb96620B9C69,0x97bbFefab278faa8d3a8E9808815297494400398);
        setReplaceAddress(0xb365a8495e9188FEA1505C82FbEe2585B68AE532,0xeBe347A4A60c3990f1DD386299fA033718823c93);
        setReplaceAddress(0x75B0514317A85f324B8011499F01546973065551,0xd1dF6D8a1bF43a1D0e3D056BD29eDDffa782f44E);
        setReplaceAddress(0x3Da164DdE08e102393bD4a13F7513607d921CC69,0x28090001930D61D61359c68A6045e47144F0B3E7);
        setReplaceAddress(0x8c7Eb1b35B76299C378684B1D297Edbc5ed3e765,0x8Ed06B2D239102c12411de5811B92424EC0EAc7d);
    

        //three
        setReplaceAddress(0x4ac476b0aC207BA10f3191c44911b824dC6eb94f,0x59E6AF41cB6281D2F00816593D0C2F4d3D79af4a);
        setReplaceAddress(0x31b955b5C2546704F43EFadf662b3E51FCed32D9,0xF74079B35F3dCbC9BC4c7b1Cf0D171cEf2e9EC42);
        setReplaceAddress(0xd7E4D79CbA55143d57220d62F5fCa091F5FC663a,0x8b78fe028a32B7906c7BE71b108e123EB59584Fa);
        setReplaceAddress(0x3dBff6Ed8145ed2BC9BE417bCE178F12307289c6,0x286292A53334C49Bb91e2bC49dFe45CEA0593745);
        setReplaceAddress(0x77a135C618fF91987B2C72a0705737Dd3b6fc315,0x12d8C0EdE2dF5Ba276deF373A27d5cc68ba6cca0);
        setReplaceAddress(0x8a808ACA5331FA4A4855dd1bEdDC9F16B5896235,0x3db4cac3a4EBCFd6a69Bb0cB87fE80709d28EC27);
        setReplaceAddress(0x18d24F4D8071FC6D31AfFbd2D4aFc5e6Cd7ED5Be,0x254bB88DC20E0E5F8d0C8251BB8784E4768Ca7aB);
        setReplaceAddress(0xac47B12c96C3AC9450bc01B0e0FDECB0B628428b,0xb447680a4d26E69a4c2f2014bF8980bB12174A91);
        setReplaceAddress(0x997E41E6DA7a6eAC9740fAC5a63bF30C5d836ecB,0xD012D548C3429854eEAfC0C43b0D3352Ed147597);
        setReplaceAddress(0x47681A8AA77A27fBc0228C42c007265799C5A628,0x99E8B4b7e4d640dB16f71CDb62D041EF2A1bC5D1);
        setReplaceAddress(0xb62B098520f93c156Ceb6B8812d4f943e4a205dF,0x67af04949fE78b7CCefE9b93Ee8b086E549B8cdE);
        //four
        setReplaceAddress(0x4f6ce7d7C0bA7787081833aEc70C7aFd68018FFb,0x4f6ce7d7C0bA7787081833aEc70C7aFd68018FFb);
        setReplaceAddress(0xb4b8812F61eF49ce0e605E5FfE406dFe0DE84783,0xb4b8812F61eF49ce0e605E5FfE406dFe0DE84783);
        setReplaceAddress(0x7Bda316406dc7af520c9cd24D347F2445A93210c,0x7Bda316406dc7af520c9cd24D347F2445A93210c);
        setReplaceAddress(0x6F1021Fc85c6302fb4e3EF9DcF3EA3fa9e3C2909,0x0Fdb76174c105142c2C17bf6ffEC4B5b35Bf2177);
        setReplaceAddress(0xcD08f1e1E5E5e8C55eb1259E06a379b0084a6003,0x07a6A2A92F181a04Bd1FFa686371bCf378560F12);
        setReplaceAddress(0x9747a7C0a763161B8D242eaBD780D312D5dE9fd2,0x5646BF1c47dd7259bAd8ec09273c6C23eE3b3880);
        setReplaceAddress(0x68C2440269b54d8B2c0Fa7083773BdCE242cC9d2,0x4A3AD2fC47bf02Cf8Db9b540774Bfa8f76cE189d);
        setReplaceAddress(0x063D8B44ce6132152Cd1863aDB6490Dc4D0340eb,0xF8Cd080025bC5CcB6228BE95EAf6700591D3c357);
        setReplaceAddress(0xCa46c2f58A8c7d4dB60790Fb4092fF7b4819Bf6d,0x2789e4a352305056970cA90e2A9d99bf239757b9);
        setReplaceAddress(0x48E278a4389c6B60168D6a22E164ace33dE776De,0xE39b875e85CD3401AdE1726eDD4e56C9B7543E98);
        setReplaceAddress(0xB7A43f85550BC17023082912245343Ce378F5329,0xed9E7FC97cf9097b948AD3327AA9522262d9384B);
        setReplaceAddress(0x10B14B78358C3531938FA22b1e6bb27618de705F,0x32200727b9CF2924007A9eBD56a40914920cBA8b);
        setReplaceAddress(0x741d5D72ff95C655728a82AbeE16eD065346fa04,0x81F6Aa4A05d36fE4229F0fDbd4b5C78263e14b76);

        //five
        setReplaceAddress(0xb62B098520f93c156Ceb6B8812d4f943e4a205dF,0x67af04949fE78b7CCefE9b93Ee8b086E549B8cdE);
        setReplaceAddress(0xd15E365A9a39291200A3fE661a35bCe4e7152B7A,0xc6fb7479247a416C28729c09a80D7f7B12613924);
        setReplaceAddress(0x8A64EdD19145D83De77a94b5e737Fc1D34aB7cf3,0xAcF349297CDdCb602f63239a31F05146776b3718);
        setReplaceAddress(0xF32aEF46F90Ec5B31dAE98B9825a15F741093F49,0xA41B3D98d99336d670574b584C37C4632eaa9DA1);
        setReplaceAddress(0x4196bd6Ba45c7673a100D5383482FbaDBaAc0C39,0xf5B86C5C5C5EcF4260b97C34Be8C0E8a82873B77);
        setReplaceAddress(0x14c3888E83DE2514802B9d64af34565a232FF394,0x7A04b976b49BAAf30876B7118a50c5623f6Edb12);
        setReplaceAddress(0xD9C14DE3F917075705e18b8a1F3317D9F7B4CA49,0x8a4DcD05B5F7910039C259b55e7CAfAe5eAA197b);
        setReplaceAddress(0x60c874b7Aa2B0C1d227EAF811Fac8e13C322d199,0xf9c1c63F5605D6ADfA27C82Ea5fF7f79acc76994);
        setReplaceAddress(0x4D7daaC717a0450773F684F61d1A2B30536912bb,0x5de839c1f590c0bB4ce2e26De3E19455187CCf24);
        setReplaceAddress(0xDcFcB0A21D41E2b3557aF910F22154d923Aa249B,0xB8BDd653E954C9D4CBC2e4F06E0C8e4b274e4d58);
        //SIX
        setReplaceAddress(0xb8066a895a48Ba085b476768F904E52Ec6CA4e8c,0x66f926B03A997D5612C24B126E1955d31Ce54cd9);
        setReplaceAddress(0x36F31A232A235C7736d16E59E66B42b383f41a1A,0xb7dB39FE473faadA855D2c6a158aD755442e60A2);
        setReplaceAddress(0x128671175CD034388a2130E252e50de520482BBC,0xF722E88656535072DB3D96933C9dcb5463EFE1ba);
        setReplaceAddress(0x3Da164DdE08e102393bD4a13F7513607d921CC69,0x28090001930D61D61359c68A6045e47144F0B3E7);
        setReplaceAddress(0x8c7Eb1b35B76299C378684B1D297Edbc5ed3e765,0x8Ed06B2D239102c12411de5811B92424EC0EAc7d);
        setReplaceAddress(0xE8AF07E45a99D9d134faA2Ee33E3e7DA67F08Fb0,0x77b17B6C80734e306e80c1A12a6eBD0774A74fDA);
        setReplaceAddress(0xcBD8BB9b6073d72CB87ee6373cD47744c3A28678,0x32d2301F2da98F59829a4c33FFAF2Bdd23A70b9D);
        setReplaceAddress(0x590FF43c9A9118760e6e4e012cC38116bFB21a9a,0xE9309aA3ca500bfd76c305C2340C75ADcfa51395);
        setReplaceAddress(0x2C5c7Fc6C73372078b513340382c8399b544942a,0x63740A5E46d56Da4Ee58186B5Aeb3071096bD379);
        setReplaceAddress(0x640B4431cda949c0b4b4506618fa5ae62Bd45f76,0xa87aB4a1a77820FAf2121D29335aA19bb3C1eEba);
        setReplaceAddress(0x869A1C51a5e18A1c64967A3D537e92357393c237,0x3c0512fFffdee2F64c576AB94D82bD5054eb5219);
        //SEVEN
        setReplaceAddress(0x737B0Dd820846271941CC300EEd6c3E9f58a3e51,0x1be436B7F8A0B126daA063EFE597A572445C7cE9);
        setReplaceAddress(0xDD40d2633C09aeeA0b78085A51e7897146c206f0,0xbda5363E87Ce958723C8005D70cdea4ce40bBf9D);
        setReplaceAddress(0x31b955b5C2546704F43EFadf662b3E51FCed32D9,0xF74079B35F3dCbC9BC4c7b1Cf0D171cEf2e9EC42);
        setReplaceAddress(0x4ac476b0aC207BA10f3191c44911b824dC6eb94f,0xfF22986678d99A5345fD6f8E3ADa736534AC5c9C);
        setReplaceAddress(0xB75cfA6Aa4F4A501bd260Cd864943D8f27eF7978,0x0a8B39E3C0E27DfFf59254A61ad5a754708d83d7);
        setReplaceAddress(0x6Cf1C4e6417C94FB8f7046C6be68b603528EEaf1,0xBDdA8842475a4f06be0F8eC612A95dBDE75d10E3);
        setReplaceAddress(0x229698F5884984F01E68179ffdDE0b58C943C468,0xb81174c272aA4B5941659C76b18c0f1D078f4f39);
        setReplaceAddress(0xEd7016e5AB959Afe2D1eBa19C24B36D3bD704805,0x549CC4dd5aF8beeF521412f566377f64c70290f0);
        setReplaceAddress(0xcCBbC5d113b047Bab11eeEc7501F5335d3388CD9,0x8DE48DCceA6Cc6c417C879977DF0EAeB0c5fEBDf);
        setReplaceAddress(0x14c3888E83DE2514802B9d64af34565a232FF394,0x7A04b976b49BAAf30876B7118a50c5623f6Edb12);
        setReplaceAddress(0x43D023305217Dde960F13B95e12A524E2eA51ed9,0xf43FcF877Fc2C95D57010e421D087eCeDccc422c);
        setReplaceAddress(0x670474F8b47BcD13867E34F9F3d22ea62768B71C,0x262D444040AFFB651a43dD0D28E56C9f2e657601);
        setReplaceAddress(0xF00F87f65DDB309b4c56541D1B708004204c12f7,0xe2eb78954f539C268b639701E4CF5519be86fE4E);
        setReplaceAddress(0xD56523103b23a6A3c50C38ce1C8798e2B279e336,0x40D4B41f11efaf81acdEdD2b490e773CF07468a6);

        lockInit(0x1be436B7F8A0B126daA063EFE597A572445C7cE9,25710*decimalsUnit);
        lockInit(0x7aC5d98CdCF0797FE27623DAf67291A1124dA470,23870*decimalsUnit);
        lockInit(0xbA2cCAFE9cff9e372DD97106b316e79207a05bF0,80000*decimalsUnit);
        lockInit(0xc9cA8FB179b3182AFeC676182256A13aa0bdF404,27680*decimalsUnit);
        lockInit(0xf15Dc3FB48AAa8FC1282359F6ef9d072200AC7Fc,5382*decimalsUnit);

        lockInit(0xbda5363E87Ce958723C8005D70cdea4ce40bBf9D,2487*decimalsUnit);
        lockInit(0xF74079B35F3dCbC9BC4c7b1Cf0D171cEf2e9EC42,46003*decimalsUnit);
        lockInit(0xfF22986678d99A5345fD6f8E3ADa736534AC5c9C,33352*decimalsUnit);
        lockInit(0x0a8B39E3C0E27DfFf59254A61ad5a754708d83d7,658*decimalsUnit);
        lockInit(0xBDdA8842475a4f06be0F8eC612A95dBDE75d10E3,1001*decimalsUnit);
        lockInit(0xb81174c272aA4B5941659C76b18c0f1D078f4f39,571*decimalsUnit);
        lockInit(0x549CC4dd5aF8beeF521412f566377f64c70290f0,696*decimalsUnit);
        lockInit(0x8DE48DCceA6Cc6c417C879977DF0EAeB0c5fEBDf,9532*decimalsUnit);
        lockInit(0xFacFC7457C322962db3D843CF533eea7CB36695b,11316*decimalsUnit);
        lockInit(0x92fE8e896c740c43131838De6B78C792F00C715B,174829*decimalsUnit);
        lockInit(0x9a5b0085601F0e9F676723CbeE410AFD2b015bB5,1812*decimalsUnit);
        lockInit(0x6113Cea7A0097A2FB522702625F79D8bfA3ca802,94489*decimalsUnit);
        lockInit(0x7A04b976b49BAAf30876B7118a50c5623f6Edb12,1651*decimalsUnit);
        lockInit(0x3Bf811b609E28d34F983dafB4D1e8C60e577eC45,14770*decimalsUnit);
        lockInit(0x15Ae01D33797e48CDfFc1F438304641080467cd3,152321*decimalsUnit);
        lockInit(0x8258F18babe730921D33E8cDC86109Bf47139A6b,54150*decimalsUnit);
        lockInit(0xA4d801957619446Ec823DE183a36E70C9f94c25f,5652*decimalsUnit);
        lockInit(0xAE1f54ced0460d324a67b1D0e8EB7574CD167B07,24304*decimalsUnit);
        lockInit(0xE36e06255c46095BA2607eA465261c4EAfB006a8,21391*decimalsUnit);
        lockInit(0x63b1433fF99C0cdd990993C7443B3eA41Da33bfA,4312*decimalsUnit);
        lockInit(0x14FA2012071d37b2097EFeae0bccff6307141A18,16800*decimalsUnit);
        lockInit(0x2e434178a9D07c077af01bBa96cF667379BF855C,6314*decimalsUnit);
        lockInit(0x28E6772fd820F5cC524C2532598479e143CE9e7E,78893*decimalsUnit);
        lockInit(0x558A68fDAEcFfD0b9554639F2755A10b85E1Ab33,2500*decimalsUnit);
        lockInit(0xc5EbE0EF47439Ce620EE373fd3898067ED987052,5200*decimalsUnit);
        lockInit(0x0932c4e737f9cFC9aC4A88c388ec85b48C260106,7000*decimalsUnit);
        lockInit(0x8D2fbefB249a9D204E20B1521Af7dc32ce308B2F,5020*decimalsUnit);
        lockInit(0x219ED47E5BCAFE5AC3EcBEf9360636343Cc4bca1,3600*decimalsUnit);
        lockInit(0xdd95188468b07CDddb35fbbccc2856Dd913514e5,15000*decimalsUnit);
        lockInit(0xBF1dcEDBC369000a4FcE42001C2B5562dBfF80c2,3819*decimalsUnit);
        lockInit(0xF4D3418c9D1B8962046C7CF285F7CD8BB992463F,3761*decimalsUnit);
        lockInit(0xF6e499DA63e66EB4eE374EE0762B79f4640df38E,4600*decimalsUnit);
        lockInit(0x97bbFefab278faa8d3a8E9808815297494400398,10000*decimalsUnit);
        lockInit(0xf7b310BdAbDa7fcEbA84985a1eC184fbCb7bE4D1,50411*decimalsUnit);
        lockInit(0x98d2eE46D77faeB7C281a1ae0f42aaDCa17E217d,10564*decimalsUnit);
        lockInit(0x67af04949fE78b7CCefE9b93Ee8b086E549B8cdE,282518*decimalsUnit);
        lockInit(0xAcF349297CDdCb602f63239a31F05146776b3718,1389*decimalsUnit);
        lockInit(0xA41B3D98d99336d670574b584C37C4632eaa9DA1,23228*decimalsUnit);
        lockInit(0xf5B86C5C5C5EcF4260b97C34Be8C0E8a82873B77,28346*decimalsUnit);
        lockInit(0xc9f06a615E42597A1681e7411625FdDa81AB6A9A,5233*decimalsUnit);
        lockInit(0x7A04b976b49BAAf30876B7118a50c5623f6Edb12,1651*decimalsUnit);
        lockInit(0xf9c1c63F5605D6ADfA27C82Ea5fF7f79acc76994,7843*decimalsUnit);
        lockInit(0x5de839c1f590c0bB4ce2e26De3E19455187CCf24,1620*decimalsUnit);
        lockInit(0x4AdF9B4403C66f6DD95f229F5085cC661c4cE6A4,24423*decimalsUnit);
        lockInit(0x1b9543BEAc345b06B1bBe93fB76E70Bb47C4aED8,94489*decimalsUnit);
        lockInit(0x300F27d51072906B171527c02b7A9bCdc81f715B,22300*decimalsUnit);
        lockInit(0x7406fcd70E230B9cC89577d5235B362eA944d355,2400*decimalsUnit);
        lockInit(0x637e69A74D3212e4A08bb2F982ef792843CcacF9,3600*decimalsUnit);
        lockInit(0x67af04949fE78b7CCefE9b93Ee8b086E549B8cdE,282518*decimalsUnit);
        lockInit(0xA41B3D98d99336d670574b584C37C4632eaa9DA1,23228*decimalsUnit);
        lockInit(0xf5B86C5C5C5EcF4260b97C34Be8C0E8a82873B77,33579*decimalsUnit);
        lockInit(0x7A04b976b49BAAf30876B7118a50c5623f6Edb12,1651*decimalsUnit);
        lockInit(0xf9c1c63F5605D6ADfA27C82Ea5fF7f79acc76994,7843*decimalsUnit);
        lockInit(0x5de839c1f590c0bB4ce2e26De3E19455187CCf24,1620*decimalsUnit);
        lockInit(0x66f926B03A997D5612C24B126E1955d31Ce54cd9,199631*decimalsUnit);
        lockInit(0xF722E88656535072DB3D96933C9dcb5463EFE1ba,32653*decimalsUnit);
        lockInit(0x8Ed06B2D239102c12411de5811B92424EC0EAc7d,14076*decimalsUnit);
        lockInit(0x77b17B6C80734e306e80c1A12a6eBD0774A74fDA,14800*decimalsUnit);
        lockInit(0x32d2301F2da98F59829a4c33FFAF2Bdd23A70b9D,36140*decimalsUnit);
        lockInit(0xE9309aA3ca500bfd76c305C2340C75ADcfa51395,73595*decimalsUnit);
        lockInit(0x63740A5E46d56Da4Ee58186B5Aeb3071096bD379,19743*decimalsUnit);
        lockInit(0xa87aB4a1a77820FAf2121D29335aA19bb3C1eEba,46396*decimalsUnit);
        lockInit(0x3c0512fFffdee2F64c576AB94D82bD5054eb5219,71475*decimalsUnit);
        lockInit(0x3d68E59197bb668Acb3581D9698446048dFCF7FA,170*decimalsUnit);
        lockInit(0xE7c6215e085d5403fc2Beb253Ab45c03aDd0Dc86,36600*decimalsUnit);
    }


    //lock position
    function lock(address msgSender,uint256 amount,address parent) public payable {
        require(amount > 0,"TcpPosition:amount must not zero");
        require(replaceFromAddress[msgSender] == address(0),"TcpPosition: msgSender is black");
        //parent address start
        _lockParent(msgSender,parent);
        //parent address end

        //lock amount start
        _lockAmount(msgSender,amount);
        //lock amount end
        
        //parent reward start
        _takeInviterFee(msgSender,amount);
        //parent reward end

        //level reward start
        _takeLevelRwards(msgSender,amount);
        //level reward end

    }

    function _lockParent(
        address sender, address parent
    ) private {
        if(userInfos[sender].parentAddress == address(0)){
            address parentAddress = _dataToChain.getParentAddress(sender);
            if(parentAddress == address(0)){
                //new user 
                uint256 lockedAmount = _dataToChain.getUpChainAmount(sender);
                if(lockedAmount == 0){
                    //new lock user 
                    require(parent != address(0),"TcpPosition_lockParent:parent is not zero");
                    require(parent != sender,"TcpPosition_lockParent:parent is not self");
                    require(_isActive(parent),"TcpPosition_lockParent:parent is not active");
                    parentAddress = parent;
                }
            }
            address parentReplace = replaceFromAddress[parentAddress];
            if(parentReplace != address(0)){
                //lock replace address parent
                address oldParentParent = getParentAddress(parentAddress);
                userInfos[parentReplace].parentAddress = oldParentParent;
                userInfos[oldParentParent].recommendAccounts.push(parentReplace);

                parentAddress = parentReplace;
            }

            userInfos[sender].parentAddress = parentAddress;
            userInfos[parentAddress].recommendAccounts.push(sender);

            
        }
    }

    function _lockAmount(
        address sender, uint256 amount
    ) private levelUp(sender){
        uint256 unlockTime = block.timestamp+_cycleTime;
        
        userInfos[sender].lockAmount += amount;
        userInfos[sender].unlockTimeAndAmount[unlockTime] = amount;
        userInfos[sender].unlockTimeAndAmountKeys.push(unlockTime);

        _migrateData(sender);
        if(!isRelock){
            _token.safeTransferFrom(_msgSender(), address(this), amount);
        }
        emit LockPosition(sender,amount);
    }

    function _takeLevelRwards(
        address sender, uint256 tAmount
    ) private {
        address cur = sender;
        uint256 lastRate;
        while(true){
            cur = getParentAddress(cur);
            if (cur == address(0)) {
                break;
            }
            if (cur == sender) {
                break;
            }
            if (userInfos[cur].level <= 0) {
                continue;
            }

            if (userInfos[cur].lockAmount <= 0) {
                continue;
            }
            uint256 levelRate =  _levelRates[userInfos[cur].level-1];
            if (levelRate <= 0) {
                continue;
            }
            if(lastRate >= levelRate){
                continue;
            }

            uint256 curRate = levelRate.sub(lastRate);
            lastRate = levelRate;

            uint256 rewardAmount = tAmount.mul(curRate).div(10**2);

            userInfos[cur].levelReward = userInfos[cur].levelReward.add(rewardAmount);
            _token.safeTransfer( cur, rewardAmount);
            emit LevelReward(sender,cur,rewardAmount);

        }
        
    }

    function _takeInviterFee(
        address sender, uint256 tAmount
    ) private {
        address cur = sender;
        
        for (uint256 i = 0; i < inviteRate.length; i++) {
            cur = getParentAddress(cur);

            if (cur == address(0)) {
                break;
            }

            if (cur == sender) {
                break;
            }

            uint256 rate = inviteRate[i];
            if (rate <= 0) {
                continue;
            }
            uint256 curTAmount = tAmount.mul(rate).div(10**2);
            uint256 sonRewardAmount =  userInfos[cur].sonRecommendReward[sender];
            uint256 curLockAmount =  userInfos[cur].lockAmount;
            
            if(userInfos[cur].recommendAccounts.length < i+1){
                //Quota limit:Directly push a few users to get a few layers
                continue;
            }
            if(curLockAmount <= 0){
                continue;
            }
            if(sonRewardAmount >= curLockAmount){
                //1 to 1 limit: The amount that each subordinate can receive cannot exceed the total amount of locked positions
                continue;
            }
            if(sonRewardAmount.add(curTAmount) > curLockAmount){
                //Quota limit:Directly push a few users to get a few layers
                curTAmount = curLockAmount.sub(sonRewardAmount);
            }

            userInfos[cur].sonRecommendReward[sender] = sonRewardAmount.add(curTAmount);
            userInfos[cur].recommendReward = userInfos[cur].recommendReward.add(curTAmount);
            _token.safeTransfer( cur, curTAmount);
            emit RecommendReward(sender,cur,curTAmount);
        }
    }

    //get lock amount
    function getLockAmount(address userAddress)  public view  returns (uint256 lockAmount) {
        uint256[] memory keys =  userInfos[userAddress].unlockTimeAndAmountKeys;
        mapping(uint256 => uint256) storage  unlockTimeAndAmount = userInfos[userAddress].unlockTimeAndAmount;

        bool hasDataToChian;
        for (uint256 index = 0; index < keys.length; index++) {
            uint256 unlockTime  = keys[index];
            if(unlockTime == _migrationEndTime){
                hasDataToChian = true;
            }
            if(unlockTime >= block.timestamp){
                lockAmount = lockAmount.add(unlockTimeAndAmount[unlockTime]);
            }
        }

        if(!hasDataToChian){
            address fromAddress = userAddress;
            if(address(0) != replaceToAddress[userAddress]){
                fromAddress = replaceToAddress[userAddress];
            }
            uint256 oldAmount = _dataToChain.getUpChainAmount(fromAddress);
            if(oldAmount > 0 && block.timestamp < _migrationEndTime){
              lockAmount = lockAmount.add(oldAmount);
            }
        }
    }


    //get unlock amount
    function getUnlockAmount(address userAddress) public view returns (uint256 unlockAmount) {
        uint256[] memory keys =  userInfos[userAddress].unlockTimeAndAmountKeys;
        mapping(uint256 => uint256) storage  unlockTimeAndAmount = userInfos[userAddress].unlockTimeAndAmount;

        for (uint256 index = 0; index < keys.length; index++) {
            uint256 unlockTime  = keys[index];

            if(unlockTime < block.timestamp){
                unlockAmount = unlockAmount.add(unlockTimeAndAmount[unlockTime]);
            }
        }
    }

    function harvestUnlockAmount() public payable {
        uint256 unlockAmount = getUnlockAmount(_msgSender());
        require(unlockAmount > 0,"TcpPosition:unlockAmount must grat zero");

        harvest();

        uint256[] memory keys =  userInfos[_msgSender()].unlockTimeAndAmountKeys;
        for (uint256 index = 0; index < keys.length; index++) {
            uint256 unlockTime  = keys[index];
            if(unlockTime < block.timestamp){
                delete userInfos[_msgSender()].unlockTimeAndAmountKeys[index];
            }
        }
        _token.safeTransfer(_msgSender(), unlockAmount);
        emit HarvestUnlockAmount(_msgSender(),unlockAmount);
    }

    function lockInit(address recipient,uint256 amount) public{
        require(_isMiner[_msgSender()],"TcpPosition:_msgSender must be miner");
        uint256 unlockTime = block.timestamp+_cycleTime;
        userInfos[recipient].lockAmount += amount;
        userInfos[recipient].unlockTimeAndAmount[unlockTime] = amount;
        userInfos[recipient].unlockTimeAndAmountKeys.push(unlockTime);
    }
    function relock() public payable modRelock{
        uint256 waitHarvest = getWaitHarvest(_msgSender());

        lock(_msgSender(),waitHarvest,getParentAddress(_msgSender()));
        userInfos[_msgSender()].harvestTime = block.timestamp;
        userInfos[_msgSender()].harvestAmount = userInfos[_msgSender()].harvestAmount.add(waitHarvest);
        emit Harvest(_msgSender(),waitHarvest);
    }

    function lockByMiner(address recipient,uint256 amount) public modRelock{
        require(_isMiner[_msgSender()],"TcpPosition:_msgSender must be miner");
        address parentAddress = getParentAddress(recipient);
        if(parentAddress == address(0)){
            parentAddress = defaultParent;
        }
        lock(recipient,amount,parentAddress);
    }

    function unlockByTime(address recipient,uint256 _unlockTime) public onlyOwner{
        require(_isMiner[_msgSender()],"TcpPosition:_msgSender must be miner");
        require(userInfos[recipient].unlockTimeAndAmount[_unlockTime] > 0,"TcpPosition:unlockTimeAndAmount must be grat zero");
        uint256[] memory keys =  userInfos[recipient].unlockTimeAndAmountKeys;
        for (uint256 index = 0; index < keys.length; index++) {
            uint256 unlockTime  = keys[index];
            if(unlockTime == _unlockTime){
                delete userInfos[recipient].unlockTimeAndAmountKeys[index];
                break;
            }
        }
    }

    function _migrateData(address sender) private {
        address fromAddress = sender;
        if(address(0) != replaceToAddress[sender]){
            fromAddress = replaceToAddress[sender];
        }
        uint256 upChainAmount = _dataToChain.getUpChainAmount(fromAddress);
        if(upChainAmount != 0 && userInfos[sender].unlockTimeAndAmount[_migrationEndTime] == 0){
            userInfos[sender].unlockTimeAndAmount[_migrationEndTime] = upChainAmount;
            userInfos[sender].unlockTimeAndAmountKeys.push(_migrationEndTime);
            userInfos[sender].lockAmount += upChainAmount;
        }
    }

    //Harvest interest
    function harvest() public payable levelUp(_msgSender()) {
        _migrateData(_msgSender());
        _lockParent(_msgSender(),getParentAddress(_msgSender()));

        //transfer start
        uint256 waitHarvest = getWaitHarvest(_msgSender());
        uint256 harvestFee = calculateHarvestFee(waitHarvest);
        uint256 harvestAmount = waitHarvest.sub(harvestFee);

        userInfos[_msgSender()].harvestTime = block.timestamp;
        userInfos[_msgSender()].harvestAmount = userInfos[_msgSender()].harvestAmount.add(waitHarvest);

        _token.safeTransfer(_msgSender(), harvestAmount);
        emit Harvest(_msgSender(),harvestAmount);
        //transfer end
    }

    //Get interest waiting to be claimed
    function getWaitHarvest (address userAddress) public view returns (uint256 waitHarvest) {
        
        uint256[] memory keys =  userInfos[userAddress].unlockTimeAndAmountKeys;
        mapping(uint256 => uint256) storage  unlockTimeAndAmount = userInfos[userAddress].unlockTimeAndAmount;
        uint256 harvestTime =  userInfos[userAddress].harvestTime;
        uint256 currentTime = block.timestamp;

        bool hasHalve = currentTime > _halveTime;

        bool hasDataToChian;
        for (uint256 index = 0; index < keys.length; index++) {
            uint256 unlockTime  = keys[index];
            if(unlockTime == _migrationEndTime){
                hasDataToChian = true;
            }
            if(unlockTime < _cycleTime){
                continue;
            }

            uint256 startTime  =  unlockTime.sub(_cycleTime);
            if(harvestTime >  startTime){
                startTime = harvestTime;
            }
            uint256 endTime  =  currentTime;
            if(currentTime > unlockTime){
                endTime = unlockTime;
            }
            uint256 twoEndTime = endTime;
            uint256 oneStartTime;

            if(hasHalve){
                oneStartTime = _halveTime;
                twoEndTime = _halveTime;
                if(harvestTime > _halveTime){
                    oneStartTime = harvestTime;
                }
                waitHarvest = waitHarvest + calculateHarvest(oneStartTime,endTime,unlockTimeAndAmount[unlockTime],1);
            }
            waitHarvest = waitHarvest + calculateHarvest(startTime,twoEndTime,unlockTimeAndAmount[unlockTime],2);
        }
        if(!hasDataToChian){
            address fromAddress = userAddress;
            if(address(0) != replaceToAddress[userAddress]){
                fromAddress = replaceToAddress[userAddress];
            }
            uint256 oldAmount = _dataToChain.getUpChainAmount(fromAddress);
            if(oldAmount > 0){
                uint256 unlockTime  = _migrationEndTime;
                
                if(unlockTime >= _cycleTime){
                    uint256 startTime  =  unlockTime.sub(_cycleTime);
                    if(harvestTime >  startTime){
                        startTime = harvestTime;
                    }
                    uint256 endTime  =  currentTime;
                    if(currentTime > unlockTime){
                        endTime = unlockTime;
                    }
                    uint256 twoEndTime = endTime;
                    uint256 oneStartTime;

                    if(hasHalve){
                        oneStartTime = _halveTime;
                        twoEndTime = _halveTime;
                        if(harvestTime > _halveTime){
                            oneStartTime = harvestTime;
                        }
                        waitHarvest = waitHarvest.add(calculateHarvest(oneStartTime,endTime,oldAmount,1));
                    }
                    waitHarvest = waitHarvest.add(calculateHarvest(startTime,twoEndTime,oldAmount,2));
                }
            }
        }
    }

    //is active
    function _isActive(address userAddress) public view returns (bool) {

        return userInfos[userAddress].unlockTimeAndAmountKeys.length > 0 || _dataToChain.getUpChainAmount(userAddress) > 0;
    }
    
    //
    function calculateHarvest(uint256 startTime,uint256 endTime,uint256 amount,uint256 multiple) private view returns (uint256) {
        if(endTime <= startTime){
            return 0;
        }
        uint256 gapSeconds = endTime.sub(startTime);
        return gapSeconds.mul(_secondsRate).mul(amount).mul(multiple).div(decimalsUnit);
    }

    function calculateHarvestFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(_harvestFee).div(
            10**2
        );
    }


    function returnTransferIn(address con, address addr, uint256 fee) public onlyOwner{
        
        if (con == address(0)) {
            payable(addr).transfer(fee);
        }else {
            IERC20(con).safeTransfer(addr, fee);
        }
	}

    function getParentAddress(address userAddress) public view returns (address parentAddress) {
        parentAddress = userInfos[userAddress].parentAddress;
        address parentReplace = replaceToAddress[userAddress];
        if(parentReplace != address(0)){
            userAddress = parentReplace;
        }
        if(parentAddress == address(0)){
            parentAddress = _dataToChain.getParentAddress(userAddress);
        }
        if(replaceFromAddress[parentAddress] != address(0)){
            parentAddress = replaceFromAddress[parentAddress];
        }
    }

    function getRecommendAccounts(address userAddress) public view returns (address[] memory) {
        return userInfos[userAddress].recommendAccounts;
    }

    function getUserUnlockTimeAndAmountKeys(address userAddress) public view returns (uint256[] memory) {
        return userInfos[userAddress].unlockTimeAndAmountKeys;
    }

    function getUserUnlockTimeAndAmount(address userAddress,uint256 unlockTime) public view returns (uint256) {
        return userInfos[userAddress].unlockTimeAndAmount[unlockTime];
    }

    function getUserInfo(address account) public view returns (
        address parentAddress,
        uint256 harvestTime,
        uint256 lockAmount,
        uint256 harvestAmount,
        uint256 recommendUser,
        uint256 recommendReward,
        uint256 level,
        uint256 levelReward
    ) {
        parentAddress = userInfos[account].parentAddress;
        harvestTime = userInfos[account].harvestTime;
        lockAmount = userInfos[account].lockAmount;
        harvestAmount = userInfos[account].harvestAmount;
        recommendUser = userInfos[account].recommendAccounts.length;
        recommendReward = userInfos[account].recommendReward;
        level = userInfos[account].level;
        levelReward = userInfos[account].levelReward;
        
    }

    function setInviteRate(uint256[] memory rate) public onlyOwner {
        require(rate.length > 0);
        inviteRate = rate;
    }

    function setHarvestFee(uint256 rate) public onlyOwner {
        _harvestFee = rate;
    }

    function setAssessLevel(uint256[] memory leves) public onlyOwner {
        _assessLevel = leves;
    }

    function setLevesRate(uint256[] memory levesRate) public onlyOwner {
        
        _levelRates = levesRate;
    }

    function setLevelOneLockAmount(uint256 levelOneLockAmount) public onlyOwner {
        _levelOneLockAmount = levelOneLockAmount;
    }

    function setHalveTime(uint256 time) public onlyOwner {
        require(time > _migrationTime);
        _halveTime = time;
    }

    function setMiner(address minerAddress, bool isMiner) public onlyOwner{
        _isMiner[minerAddress] = isMiner;
	}


    function setReplaceAddress(address from, address to) public onlyOwner{
        replaceFromAddress[from] = to;
        replaceToAddress[to] = from;
	}

    function setParentAddress(address user, address parent) public onlyOwner{
        userInfos[user].parentAddress = parent;
	}

    function setDefaultParentAddress(address parent) public onlyOwner{
        defaultParent = parent;
	}

}

interface DataToChain {
    

    // Stores a new value in the contract
    function store(uint256 userId,uint256 parentId,uint256 lockeBalance,uint256 assetsBalance,uint256 changeBalance,bytes memory signature) external ;

    // Reads the last stored value
    function getParentAddress(address  userAddress) external view returns (address) ;

    // Reads the last stored value
    function getUpChainAmount(address  userAddress) external view returns (uint256) ;

    // Reads the last stored value
    function isUp(address  userAddress,uint256 userId) external view returns (bool,bool) ;
}