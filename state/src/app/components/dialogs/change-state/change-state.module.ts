import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChangeStateComponent} from './change-state.component';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
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
        MatDialogModule,
        RouterModule,
        FormsModule
    ],
    declarations: [ChangeStateComponent],
    exports: [ChangeStateComponent]
})
export class ChangeStateModule {
}
