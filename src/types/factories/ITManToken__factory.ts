/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ITManToken, ITManTokenInterface } from "../ITManToken";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523060601b60805234801561001757600080fd5b5060805160601c611aea61004b6000396000818161054401528181610584015281816106b501526106f50152611aea6000f3fe60806040526004361061012a5760003560e01c80635c975abb116100ab5780638da5cb5b1161006f5780638da5cb5b146102fc57806395d89b4114610324578063a457c2d714610339578063a9059cbb14610359578063dd62ed3e14610379578063f2fde38b146103bf57600080fd5b80635c975abb1461026f57806370a0823114610287578063715018a6146102bd5780638129fc1c146102d25780638456cb59146102e757600080fd5b80633659cfe6116100f25780633659cfe6146101e557806339509351146102075780633f4ba83a1461022757806340c10f191461023c5780634f1ef2861461025c57600080fd5b806306fdde031461012f578063095ea7b31461015a57806318160ddd1461018a57806323b872dd146101a9578063313ce567146101c9575b600080fd5b34801561013b57600080fd5b506101446103df565b604051610151919061178a565b60405180910390f35b34801561016657600080fd5b5061017a610175366004611744565b610471565b6040519015158152602001610151565b34801561019657600080fd5b506035545b604051908152602001610151565b3480156101b557600080fd5b5061017a6101c4366004611646565b610488565b3480156101d557600080fd5b5060405160128152602001610151565b3480156101f157600080fd5b506102056102003660046115f8565b610539565b005b34801561021357600080fd5b5061017a610222366004611744565b610602565b34801561023357600080fd5b5061020561063e565b34801561024857600080fd5b50610205610257366004611744565b610672565b61020561026a366004611682565b6106aa565b34801561027b57600080fd5b5060655460ff1661017a565b34801561029357600080fd5b5061019b6102a23660046115f8565b6001600160a01b031660009081526033602052604090205490565b3480156102c957600080fd5b50610205610760565b3480156102de57600080fd5b50610205610794565b3480156102f357600080fd5b506102056108cd565b34801561030857600080fd5b506097546040516001600160a01b039091168152602001610151565b34801561033057600080fd5b506101446108ff565b34801561034557600080fd5b5061017a610354366004611744565b61090e565b34801561036557600080fd5b5061017a610374366004611744565b6109a7565b34801561038557600080fd5b5061019b610394366004611613565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b3480156103cb57600080fd5b506102056103da3660046115f8565b6109b4565b6060603680546103ee90611a26565b80601f016020809104026020016040519081016040528092919081815260200182805461041a90611a26565b80156104675780601f1061043c57610100808354040283529160200191610467565b820191906000526020600020905b81548152906001019060200180831161044a57829003601f168201915b5050505050905090565b600061047e338484610a4c565b5060015b92915050565b6000610495848484610b70565b6001600160a01b03841660009081526034602090815260408083203384529091529020548281101561051f5760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b60648201526084015b60405180910390fd5b61052c8533858403610a4c565b60019150505b9392505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156105825760405162461bcd60e51b8152600401610516906117bd565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166105b4610d4b565b6001600160a01b0316146105da5760405162461bcd60e51b815260040161051690611809565b6105e381610d79565b604080516000808252602082019092526105ff91839190610da3565b50565b3360008181526034602090815260408083206001600160a01b0387168452909152812054909161047e9185906106399086906118d5565b610a4c565b6097546001600160a01b031633146106685760405162461bcd60e51b815260040161051690611855565b610670610eee565b565b6097546001600160a01b0316331461069c5760405162461bcd60e51b815260040161051690611855565b6106a68282610f81565b5050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106f35760405162461bcd60e51b8152600401610516906117bd565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610725610d4b565b6001600160a01b03161461074b5760405162461bcd60e51b815260040161051690611809565b61075482610d79565b6106a682826001610da3565b6097546001600160a01b0316331461078a5760405162461bcd60e51b815260040161051690611855565b610670600061106c565b600054610100900460ff166107af5760005460ff16156107b3565b303b155b6108165760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610516565b600054610100900460ff16158015610838576000805461ffff19166101011790555b61087f6040518060400160405280600a81526020016924aa26b0b72a37b5b2b760b11b8152506040518060400160405280600381526020016249544d60e81b8152506110be565b6108876110f7565b61088f61112e565b610897611165565b6108b9336108a76012600a611930565b6108b490620f42406119db565b610f81565b80156105ff576000805461ff001916905550565b6097546001600160a01b031633146108f75760405162461bcd60e51b815260040161051690611855565b61067061119c565b6060603780546103ee90611a26565b3360009081526034602090815260408083206001600160a01b0386168452909152812054828110156109905760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152608401610516565b61099d3385858403610a4c565b5060019392505050565b600061047e338484610b70565b6097546001600160a01b031633146109de5760405162461bcd60e51b815260040161051690611855565b6001600160a01b038116610a435760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610516565b6105ff8161106c565b6001600160a01b038316610aae5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610516565b6001600160a01b038216610b0f5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610516565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b038316610bd45760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610516565b6001600160a01b038216610c365760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610516565b610c41838383611217565b6001600160a01b03831660009081526033602052604090205481811015610cb95760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610516565b6001600160a01b03808516600090815260336020526040808220858503905591851681529081208054849290610cf09084906118d5565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d3c91815260200190565b60405180910390a35b50505050565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b6097546001600160a01b031633146105ff5760405162461bcd60e51b815260040161051690611855565b6000610dad610d4b565b9050610db884611262565b600083511180610dc55750815b15610dd657610dd48484611307565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16610ee757805460ff191660011781556040516001600160a01b0383166024820152610e5590869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052611307565b50805460ff19168155610e66610d4b565b6001600160a01b0316826001600160a01b031614610ede5760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b6064820152608401610516565b610ee7856113f2565b5050505050565b60655460ff16610f375760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610516565b6065805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610fd75760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152606401610516565b610fe360008383611217565b8060356000828254610ff591906118d5565b90915550506001600160a01b038216600090815260336020526040812080548392906110229084906118d5565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b609780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166110e55760405162461bcd60e51b81526004016105169061188a565b6110ed611432565b6106a68282611459565b600054610100900460ff1661111e5760405162461bcd60e51b81526004016105169061188a565b611126611432565b6106706114a7565b600054610100900460ff166111555760405162461bcd60e51b81526004016105169061188a565b61115d611432565b6106706114da565b600054610100900460ff1661118c5760405162461bcd60e51b81526004016105169061188a565b611194611432565b610670611432565b60655460ff16156111e25760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610516565b6065805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610f643390565b60655460ff161561125d5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610516565b505050565b803b6112c65760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610516565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6113665760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610516565b600080846001600160a01b031684604051611381919061176e565b600060405180830381855af49150503d80600081146113bc576040519150601f19603f3d011682016040523d82523d6000602084013e6113c1565b606091505b50915091506113e98282604051806060016040528060278152602001611a8e6027913961150a565b95945050505050565b6113fb81611262565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b600054610100900460ff166106705760405162461bcd60e51b81526004016105169061188a565b600054610100900460ff166114805760405162461bcd60e51b81526004016105169061188a565b8151611493906036906020850190611543565b50805161125d906037906020840190611543565b600054610100900460ff166114ce5760405162461bcd60e51b81526004016105169061188a565b6065805460ff19169055565b600054610100900460ff166115015760405162461bcd60e51b81526004016105169061188a565b6106703361106c565b60608315611519575081610532565b8251156115295782518084602001fd5b8160405162461bcd60e51b8152600401610516919061178a565b82805461154f90611a26565b90600052602060002090601f01602090048101928261157157600085556115b7565b82601f1061158a57805160ff19168380011785556115b7565b828001600101855582156115b7579182015b828111156115b757825182559160200191906001019061159c565b506115c39291506115c7565b5090565b5b808211156115c357600081556001016115c8565b80356001600160a01b03811681146115f357600080fd5b919050565b60006020828403121561160a57600080fd5b610532826115dc565b6000806040838503121561162657600080fd5b61162f836115dc565b915061163d602084016115dc565b90509250929050565b60008060006060848603121561165b57600080fd5b611664846115dc565b9250611672602085016115dc565b9150604084013590509250925092565b6000806040838503121561169557600080fd5b61169e836115dc565b9150602083013567ffffffffffffffff808211156116bb57600080fd5b818501915085601f8301126116cf57600080fd5b8135818111156116e1576116e1611a77565b604051601f8201601f19908116603f0116810190838211818310171561170957611709611a77565b8160405282815288602084870101111561172257600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b6000806040838503121561175757600080fd5b611760836115dc565b946020939093013593505050565b600082516117808184602087016119fa565b9190910192915050565b60208152600082518060208401526117a98160408501602087016119fa565b601f01601f19169190910160400192915050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b600082198211156118e8576118e8611a61565b500190565b600181815b8085111561192857816000190482111561190e5761190e611a61565b8085161561191b57918102915b93841c93908002906118f2565b509250929050565b600061053260ff84168360008261194957506001610482565b8161195657506000610482565b816001811461196c576002811461197657611992565b6001915050610482565b60ff84111561198757611987611a61565b50506001821b610482565b5060208310610133831016604e8410600b84101617156119b5575081810a610482565b6119bf83836118ed565b80600019048211156119d3576119d3611a61565b029392505050565b60008160001904831182151516156119f5576119f5611a61565b500290565b60005b83811015611a155781810151838201526020016119fd565b83811115610d455750506000910152565b600181811c90821680611a3a57607f821691505b60208210811415611a5b57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220b630cdfd66cdaabdc6682584faedc624a76c91211f6459a0ec2878b8a54063a264736f6c63430008070033";

type ITManTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ITManTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ITManToken__factory extends ContractFactory {
  constructor(...args: ITManTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "ITManToken";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ITManToken> {
    return super.deploy(overrides || {}) as Promise<ITManToken>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ITManToken {
    return super.attach(address) as ITManToken;
  }
  connect(signer: Signer): ITManToken__factory {
    return super.connect(signer) as ITManToken__factory;
  }
  static readonly contractName: "ITManToken";
  public readonly contractName: "ITManToken";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ITManTokenInterface {
    return new utils.Interface(_abi) as ITManTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITManToken {
    return new Contract(address, _abi, signerOrProvider) as ITManToken;
  }
}
