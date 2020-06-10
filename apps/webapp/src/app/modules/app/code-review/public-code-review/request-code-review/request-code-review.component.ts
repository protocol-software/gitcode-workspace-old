import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {RequestCodeReviewService} from "./request-code-review.service";
import {GitHubService} from "../../../../../services/github.service";
import {AuthService} from "../../../../../services/auth.service";
import {IGitHubRepo} from "@protocol/data";

@Component({
  selector: 'protocol-request-code-review',
  templateUrl: './request-code-review.component.html',
  styleUrls: ['./request-code-review.component.scss']
})
export class RequestCodeReviewComponent implements OnInit {
  // hideRequiredControl: any;
  // floatLabelControl: any;
  // options: any;
  public isReviewRequestComplete = false;

  constructor(
      public dialogRef: MatDialogRef<RequestCodeReviewComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private formBuilder: FormBuilder,
      private requestCodeReviewService: RequestCodeReviewService,
      private gitHubService: GitHubService,
      private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.gitHubService.getRepositories(user.providerUserData.github.login).subscribe((result: IGitHubRepo[]) => {
        console.log(result);
      });
    });
  }

  public async createReviewStep2(event: MouseEvent) {
    if (event) {
      // event.preventDefault();
      // event.stopPropagation();
      this.isReviewRequestComplete = true
    }
  }

  public closePopup(event) {
    this.dialogRef.close(true);
  }
}
