import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Web3Service } from '../../util/web3.service';

declare let require: any;
const simpleBankArtifact = require('../../../../build/contracts/SimpleBank.json');

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  accounts: string[];
  SimpleBank: any;

  model = {
    amount: 5,
    balance: 0,
    totalBalance: 0,
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(simpleBankArtifact)
      .then((SimpleBankAbstraction) => {
        this.SimpleBank = SimpleBankAbstraction;
        this.SimpleBank.deployed().then(deployed => {
          console.log(deployed);
          deployed.BalanceUpdated({}, (err, ev) => {
            console.log('BalanceUpdated event came in, refreshing balance');
            this.refreshBalance();
          });
        });
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async sendMoney() {
    if (!this.SimpleBank) {
      this.setStatus('SimpleBank is not loaded, unable to send transaction');
      return;
    }

    let amount = this.web3Service.toWei(this.model.amount);

    console.log('Sending money' + amount);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleBank = await this.SimpleBank.deployed();
      const transaction = await deployedSimpleBank.depositMoney.sendTransaction(
          amount, {
            from: this.model.account,
            value: amount,
            gas: 359695
          }
        );

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      const deployedSimpleBank = await this.SimpleBank.deployed();
      console.log(deployedSimpleBank);
      console.log('Account', this.model.account);
      const accountBalance = await deployedSimpleBank.getAccountBalance.call({from: this.model.account});
      console.log('Found balance: ' + accountBalance);
      this.model.balance = this.web3Service.toEther(accountBalance);

      const totalBalance = await deployedSimpleBank.getTotalBalance.call();
      console.log("Found total balance: " + totalBalance);
      this.model.totalBalance = this.web3Service.toEther(totalBalance);
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

}
