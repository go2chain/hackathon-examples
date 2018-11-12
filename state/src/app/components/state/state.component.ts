import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ChangeStateComponent } from '../dialogs/change-state/change-state.component';

declare let require: any;
const simpleStateArtifact = require('../../../../build/contracts/SimpleState.json');

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  accounts: string[];
  SimpleState: any;

  model = {
    account: '',
    state: {
      message: "",
      date: "",
      timestamp: 123
    },
    globalState: {
      message: "",
      date: "",
      timestamp: 123
    },
    inputs: {
      state: '',
      globalState: ''
    }
  };

  status = '';

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    this.watchAccount();
    this.web3Service.artifactsToContract(simpleStateArtifact)
      .then((_abstract) => {
        this.SimpleState = _abstract;
        this.SimpleState.deployed().then(deployed => {
          console.log(deployed);
          deployed.StateChanged({}, (err, ev) => {
            console.log('StateChanged event came in, refreshing state');
            this.refreshState();
          });
          deployed.StateGlogalChanged({}, (err, ev) => {
            console.log('StateGlogalChanged event came in, refreshing globalState');
            this.refreshGlobalState();
          });
        });

      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshState();
      this.refreshGlobalState();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async setActualState() {
    if (!this.SimpleState) {
      this.setStatus('SimpleState is not loaded, unable to send transaction');
      return;
    }

    const inputState = this.model.inputs.state;
    const timestamp = new Date().getTime();

    console.log(`Set actual status ${inputState} with timestamp: ${timestamp}`);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleState = await this.SimpleState.deployed();
      const transaction = await deployedSimpleState.changeState.sendTransaction(inputState, timestamp, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error setting actual state; see log.');
    }
  }

  async refreshState() {
    console.log('Refreshing state');

    try {
      const deployedSimpleState = await this.SimpleState.deployed();
      console.log(deployedSimpleState);
      console.log('Account', this.model.account);
      const actualState = await deployedSimpleState.status.call(this.model.account);
      console.log('State: ' + actualState);
      this.model.state.message = actualState[0];
      this.model.state.timestamp = actualState[1];
      this.model.state.date = new Date(actualState[1].toNumber()).toDateString();
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting state; see log.');
    }
  }

  async refreshGlobalState() {
    console.log('Refreshing global state');

    try {
      const deployedSimpleState = await this.SimpleState.deployed();
      console.log(deployedSimpleState);
      console.log('Account', this.model.account);
      const globalState = await deployedSimpleState.globalState.call();
      console.log('Global State: ' + globalState);
      this.model.globalState.message = globalState[0];
      this.model.globalState.timestamp = globalState[1];
      this.model.globalState.date = new Date(globalState[1].toNumber()).toDateString();
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting global state; see log.');
    }
  }

  async setState(_state) {
    if (!this.SimpleState) {
      this.setStatus('SimpleState is not loaded, unable to send transaction');
      return;
    }

    console.log('Set state: ' + _state);
    let timestamp = new Date().getTime();
    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleState = await this.SimpleState.deployed();
      const transaction = await deployedSimpleState.changeState.sendTransaction(
          _state, timestamp, {
            from: this.model.account,
            gas: 359695
          }
        );

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
        this.refreshState();
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error setting state; see log.');
    }
  }
  async setGlobalState(_state) {
    if (!this.SimpleState) {
      this.setStatus('SimpleState is not loaded, unable to send transaction');
      return;
    }

    console.log('Set state: ' + _state);
    let timestamp = new Date().getTime();
    let prize = this.web3Service.toWei(0.1);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedSimpleState = await this.SimpleState.deployed();
      const transaction = await deployedSimpleState.changeGlobalState.sendTransaction(
          _state, timestamp, prize, {
            from: this.model.account,
            value: prize,
            gas: 359695
          }
        );

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
        this.refreshState();
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error setting state; see log.');
    }
  }

  openChangeActualState(){
    const dialogRef = this.matDialog.open(ChangeStateComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.trim() != ""){
        console.log("result: ", result)
        this.setState(result);
      }
    });
  }
  openChangeGlobalState(){
    const dialogRef = this.matDialog.open(ChangeStateComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result && result.trim() != ""){
        console.log("result: ", result)
        this.setGlobalState(result);
      }
    });
  }

}
