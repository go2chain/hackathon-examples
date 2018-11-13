import { Injectable } from '@angular/core';
declare let require: any;
const IPFS = require('ipfs-api');
@Injectable()
export class IpfsService {
	public ipfs;
	constructor() {
    	this.ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
	}
}
