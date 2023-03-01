import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("C2CMarket", () => {
  it("Should return the FEE_FACTOR = 20", async () => {
    const C2CMarketUpgradeable = await ethers.getContractFactory("C2CMarketUpgradeable");
    const c2cMarket = await upgrades.deployProxy(C2CMarketUpgradeable);
    await c2cMarket.deployed();

    expect(await c2cMarket.FEE_FACTOR()).to.equal(20);
  });
  //创建广告订单
  it("创建广告成功", async () => {
    //创建usdt
    const ITManToken = await ethers.getContractFactory("ITManToken");
    const usdt = await upgrades.deployProxy(ITManToken);
    await usdt.deployed();
    console.log("usdt address = ",usdt.address)
    console.log("usdt owner = ",await usdt.owner());

    //创建TCP
    const tcp = await upgrades.deployProxy(ITManToken);
    await tcp.deployed();
    console.log("tcp address = ",tcp.address)
    console.log("usdt owner = ",await tcp.owner());
    const C2CMarketUpgradeable = await ethers.getContractFactory("C2CMarketUpgradeable");
    const c2cMarket = await upgrades.deployProxy(C2CMarketUpgradeable);
    await c2cMarket.deployed();
    await c2cMarket.addC2CAdvertise(await usdt.owner(),"商家",ethers.utils.parseEther("700"),7,0,0,tcp.address,usdt.address);
    await tcp.approve(c2cMarket.address,ethers.utils.parseEther("700"))
    expect(await c2cMarket.advertiseLength()).to.equal(1);
  });

  //创建交易订单
  it("创建交易订单成功", async () => {
    //创建usdt
    const ITManToken = await ethers.getContractFactory("ITManToken");
    const usdt = await upgrades.deployProxy(ITManToken);
    await usdt.deployed();
    console.log("usdt address = ",usdt.address)
    console.log("usdt owner = ",await usdt.owner());

    //创建TCP
    const tcp = await upgrades.deployProxy(ITManToken);
    await tcp.deployed();
    console.log("tcp address = ",tcp.address)
    console.log("usdt owner = ",await tcp.owner());
    const C2CMarketUpgradeable = await ethers.getContractFactory("C2CMarketUpgradeable");
    const c2cMarket = await upgrades.deployProxy(C2CMarketUpgradeable);
    await c2cMarket.deployed();
    await c2cMarket.addC2CAdvertise(await usdt.owner(),"商家",ethers.utils.parseEther("700"),7,0,0,tcp.address,usdt.address);
    await tcp.approve(c2cMarket.address,ethers.utils.parseEther("700"))

    const [owner, otherAccount] = await ethers.getSigners();
    //转账usdt和tcp
    await usdt.transfer(otherAccount.address,ethers.utils.parseEther("70"));
    await tcp.transfer(c2cMarket.address,ethers.utils.parseEther("100000"));
    console.log("卖家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(owner.address)))
    console.log("卖家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(owner.address)))
    console.log("买家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(otherAccount.address)))
    console.log("买家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(otherAccount.address)))
    //授权
    await tcp.approve(c2cMarket.address,ethers.utils.parseEther("100000"));
    await usdt.connect(otherAccount).approve(c2cMarket.address,ethers.utils.parseEther("100000"));
    console.log("商家授权数量",await tcp.allowance(owner.address,c2cMarket.address))
    console.log("卖家授权数量",await usdt.allowance(otherAccount.address,c2cMarket.address));
    await c2cMarket.connect(otherAccount).createC2COrder(0,ethers.utils.parseEther("10"));
    console.log("卖家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(owner.address)))
    console.log("卖家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(owner.address)))
    console.log("买家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(otherAccount.address)))
    console.log("买家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(otherAccount.address)))
    expect(await usdt.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("0"));
  });
  //测试分红成功
  it("测试分红成功", async () => {
    //创建usdt
    const ITManToken = await ethers.getContractFactory("ITManToken");
    const usdt = await upgrades.deployProxy(ITManToken);
    await usdt.deployed();
    console.log("usdt address = ",usdt.address)
    console.log("usdt owner = ",await usdt.owner());

    //创建TCP
    const tcp = await upgrades.deployProxy(ITManToken);
    await tcp.deployed();
    console.log("tcp address = ",tcp.address)
    console.log("usdt owner = ",await tcp.owner());
    const C2CMarketUpgradeable = await ethers.getContractFactory("C2CMarketUpgradeable");
    const c2cMarket = await upgrades.deployProxy(C2CMarketUpgradeable);
    await c2cMarket.deployed();

    //添加运营分红
    await c2cMarket.editOperate("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",5);
    await c2cMarket.editOperate("0x90F79bf6EB2c4f870365E785982E1f101E93b906",5);
    await c2cMarket.editOperate("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",5);
    await c2cMarket.editOperate("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",5);

    await c2cMarket.addC2CAdvertise(await usdt.owner(),"商家",ethers.utils.parseEther("700"),7,0,0,tcp.address,usdt.address);
    

    const [owner, otherAccount] = await ethers.getSigners();
    //转账usdt和tcp
    await usdt.transfer(otherAccount.address,ethers.utils.parseEther("1000"));
    await tcp.transfer(c2cMarket.address,ethers.utils.parseEther("100000"));
    console.log("卖家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(owner.address)))
    console.log("卖家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(owner.address)))
    console.log("买家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(otherAccount.address)))
    console.log("买家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(otherAccount.address)))
    //授权
    await tcp.approve(c2cMarket.address,ethers.utils.parseEther("100000"));
    await usdt.connect(otherAccount).approve(c2cMarket.address,ethers.utils.parseEther("100000"));
    console.log("商家授权数量",await tcp.allowance(owner.address,c2cMarket.address))
    console.log("卖家授权数量",await usdt.allowance(otherAccount.address,c2cMarket.address));
    await c2cMarket.connect(otherAccount).createC2COrder(0,ethers.utils.parseEther("11.1"));
    console.log("卖家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(owner.address)))
    console.log("卖家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(owner.address)))
    console.log("买家TCP余额",ethers.utils.formatEther(await tcp.balanceOf(otherAccount.address)))
    console.log("买家USDT余额",ethers.utils.formatEther(await usdt.balanceOf(otherAccount.address)))
    console.log("合约USDT余额",ethers.utils.formatEther(await usdt.balanceOf(c2cMarket.address)))

    console.log("运营1USDT余额",ethers.utils.formatEther(await usdt.balanceOf("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")))
    console.log("运营2USDT余额",ethers.utils.formatEther(await usdt.balanceOf("0x90F79bf6EB2c4f870365E785982E1f101E93b906")))
    console.log("运营3USDT余额",ethers.utils.formatEther(await usdt.balanceOf("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65")))
    console.log("运营4USDT余额",ethers.utils.formatEther(await usdt.balanceOf("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc")))

    expect(await usdt.balanceOf(c2cMarket.address)).to.equal(ethers.utils.parseEther("0"));

  });
});
