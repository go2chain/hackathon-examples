import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadComponent} from './upload.component';
import {RouterModule} from '@angular/router';
import {
	MatButtonModule,
	MatCardModule,
	MatFormFieldModule,
	MatInputModule,
	MatOptionModule,
	MatSelectModule, MatSnackBarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		CommonModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatSnackBarModule,
		RouterModule
	],
	declarations: [UploadComponent],
	exports: [UploadComponent]
})
export class UploadModule {}
