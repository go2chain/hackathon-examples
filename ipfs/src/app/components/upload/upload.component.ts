import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Web3Service} from '../../services/web3.service';
import { MatSnackBar } from '@angular/material';
import {Buffer} from 'buffer';
import { IpfsService } from '../../services/ipfs.service';
declare let require: any;
const simpleHashArtifact = require('../../../../build/contracts/SimpleHash.json');

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  accounts: string[];
  SimpleHash: any;
  @Input("loading") loading: boolean;
  @Output("toggleLoading") toggleLoading = new EventEmitter();
  model = {
    buffer: undefined,
    hash: '',
    account: '',
    src: "https://gateway.ipfs.io/ipfs/QmYUJmhBYrrgKBJpiq4XJWQgPGTmRDeAtAeLm8xswk5NvF"
  };

  status = '';

  constructor(
      private web3Service: Web3Service,
      private ipfsService: IpfsService,
      private matSnackBar: MatSnackBar
    ) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(simpleHashArtifact)
      .then((_simpleHashAbstraction) => {
        this.SimpleHash = _simpleHashAbstraction;
        this.SimpleHash.deployed().then(deployed => {
          console.log(deployed);
          deployed.HashUpdated({}, (err, ev) => {
            console.log('HashUpdated event came in, refreshing balance');
            this.refreshHash();
          });
        });
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshHash();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async refreshHash() {
    console.log("Refreshing hash");

    try {
      const deployedSimpleHash = await this.SimpleHash.deployed();
      console.log(deployedSimpleHash);
      console.log('Account', this.model.account);
      const hash = await deployedSimpleHash.getHash.call();
      console.log('Found hash: ' + hash);
      this.model.hash = hash;
      this.model.src = `https://gateway.ipfs.io/ipfs/${hash}`;
    } catch(e) {
      console.log("Error: ", e);
      this.setStatus('Error getting hash; see log.');
    }
  }

  async sendFile(){
    if(this.model.buffer) {
      this.toggleLoading.emit(true);
      this.ipfsService.ipfs.add(this.model.buffer, async (_err, _ipfsHash) => {
        if(_err){
          this.toggleLoading.emit(false);
          console.error("Error: ", _err);
        } else {
          this.toggleLoading.emit(false);
          let hash = _ipfsHash[0].hash;
          let nonce = await this.web3Service.getNonce(this.model.account);
          try{
            const deployedSimpleHash = await this.SimpleHash.deployed();
            const transaction = await deployedSimpleHash.sendHash.sendTransaction(
              hash, {
                  nonce: nonce + 2,
                  from: this.model.account,
                  gas: 359695
                }
              );
            if (!transaction) {
              this.setStatus('Transaction failed!');
            } else {
              this.setStatus('Transaction complete!');
              this.refreshHash();
            }
          }catch(e){
            console.log(e);
            this.setStatus('Error setting hash; see log.');
          }
        }
      });
    } else {
      alert("No file selected")
    }
  }

  captureFile(event) {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  async convertToBuffer(reader) {
    this.model.buffer = await Buffer.from(reader.result);
  };
}
