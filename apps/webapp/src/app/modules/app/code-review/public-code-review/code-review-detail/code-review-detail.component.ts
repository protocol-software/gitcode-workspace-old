import { Direction } from '@angular/cdk/bidi';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { DialogRole, MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { IGithubComment } from '@gitcode/data';
import { finalize, retry, take } from 'rxjs/operators';
import { ICodeReviewBestAnswer } from '../../../../../../../../../libs/data/src/lib/interfaces/code-review-best-answer.interface';
import { GitHubService } from '../../../../../services/github.service';
import { ExpertEvaluationComponent } from '../expert-evaluation/expert-evaluation.component';

export interface DialogData {
  item: any
}

@Component({
  selector: 'gitcode-code-review-detail',
  templateUrl: './code-review-detail.component.html',
  styleUrls: ['./code-review-detail.component.scss'],
})
export class CodeReviewDetailComponent implements OnInit {
  @HostBinding('class') public hostClass = 'code-review-detail';

  isReviewRequestComplete: any;
  animal: string;
  name: string;
  item: any;

  public comments: IGithubComment[];
  public bestAnswer: ICodeReviewBestAnswer;
  public isLoadingComments = false;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<CodeReviewDetailDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private githubService: GitHubService,
              private angularFirestore: AngularFirestore) {
    this.item = data.item;
    this.getBestAnswer();
  }

  ngOnInit(): void {
    this.loadComments();
  }

  private getBestAnswer(): void {
    if (!this.item) {
      return;
    }

    const query: QueryFn = (ref) => ref
      .where('nodeId', '==', this.item?.githubPR.node_id);
    this.angularFirestore
        .collection('code-review-best-answer', query)
        .snapshotChanges()
        .pipe(
          retry(2),
          take(1),
        )
        .subscribe(
          (docs) => {
            this.bestAnswer = docs[0]?.payload.doc.data() as ICodeReviewBestAnswer;
          },
        );
  }

  openDialog($value): void {
    if ($value === 1) {
      const dialogRef = this.dialog.open(CodeReviewDetailDialog, {
        data: { name: this.name, animal: this.animal },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }

    if ($value === 2) {
      const dialogRef = this.dialog.open(CodeReviewDetailDialog, {
        data: { name: this.name, animal: this.animal },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }
  }

  openDialogBestreview(event: MouseEvent): void {
    this.dialog.open(CodeReviewDetailDialogBestreview);
  }

  public closePopup(event): void {
    this.dialogRef.close(true);
  }

  public openExternalLink(event: MouseEvent, link: string): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!link) {
      return;
    }

    window.open(link, '_blank');
  }


  private loadComments(): void {
    const ownerName = this.item.githubPR?.user?.login;
    const repoUrl = new URL(this.item.githubPR?.url);
    const repoName = repoUrl?.pathname?.split('/')[3];

    if (!ownerName || !repoName) {
      return;
    }

    this.isLoadingComments = true;

    this.githubService.getComments(ownerName, repoName)
        .pipe(
          retry(2),
          finalize(() => {
            this.isLoadingComments = false;
          }),
        )
        .subscribe(
          (res) => {
            // For testing only!
            // if (!res || !res.length) {
            //   res = this.getMockComments();
            // }

            this.comments = res;
          },
        );
  }

  public onBestAnswerChanged(bestAnswer: ICodeReviewBestAnswer): void {
    this.bestAnswer = bestAnswer;
  }

  private getMockComments(): IGithubComment[] {
    return [
      {
        'html_url': 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e#commitcomment-1',
        'url': 'https://api.github.com/repos/octocat/Hello-World/comments/1',
        'id': 1,
        'node_id': 'MDExOlB1bGxSZXF1ZXN0NDQwMTU0OTI0',
        'body': 'Great stuff',
        'path': 'file1.txt',
        'position': 4,
        'line': 14,
        'commit_id': '6dcb09b5b57875f334f61aebed695e2e4193db5e',
        'user': {
          'login': 'octocat',
          'id': 1,
          'node_id': 'MDQ6VXNlcjE=',
          'avatar_url': 'https://i.pravatar.cc/40',
          'gravatar_id': '',
          'url': 'https://api.github.com/users/octocat',
          'html_url': 'https://github.com/octocat',
          'followers_url': 'https://api.github.com/users/octocat/followers',
          'following_url': 'https://api.github.com/users/octocat/following{/other_user}',
          'gists_url': 'https://api.github.com/users/octocat/gists{/gist_id}',
          'starred_url': 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
          'subscriptions_url': 'https://api.github.com/users/octocat/subscriptions',
          'organizations_url': 'https://api.github.com/users/octocat/orgs',
          'repos_url': 'https://api.github.com/users/octocat/repos',
          'events_url': 'https://api.github.com/users/octocat/events{/privacy}',
          'received_events_url': 'https://api.github.com/users/octocat/received_events',
          'type': 'User',
          'site_admin': false,
        },
        'created_at': '2011-04-14T16:00:49Z',
        'updated_at': '2011-04-14T16:00:49Z',
      },
      {
        'html_url': 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e#commitcomment-1',
        'url': 'https://api.github.com/repos/octocat/Hello-World/comments/1',
        'id': 2,
        'node_id': 'MDExOlB1bGxSZXF1ZXN0NDQwMTU0OTI0',
        'body': 'Great stuff',
        'path': 'file1.txt',
        'position': 4,
        'line': 14,
        'commit_id': '6dcb09b5b57875f334f61aebed695e2e4193db5e',
        'user': {
          'login': 'octocat',
          'id': 1,
          'node_id': 'MDQ6VXNlcjE=',
          'avatar_url': 'https://i.pravatar.cc/40',
          'gravatar_id': '',
          'url': 'https://api.github.com/users/octocat',
          'html_url': 'https://github.com/octocat',
          'followers_url': 'https://api.github.com/users/octocat/followers',
          'following_url': 'https://api.github.com/users/octocat/following{/other_user}',
          'gists_url': 'https://api.github.com/users/octocat/gists{/gist_id}',
          'starred_url': 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
          'subscriptions_url': 'https://api.github.com/users/octocat/subscriptions',
          'organizations_url': 'https://api.github.com/users/octocat/orgs',
          'repos_url': 'https://api.github.com/users/octocat/repos',
          'events_url': 'https://api.github.com/users/octocat/events{/privacy}',
          'received_events_url': 'https://api.github.com/users/octocat/received_events',
          'type': 'User',
          'site_admin': false,
        },
        'created_at': '2011-04-14T16:00:49Z',
        'updated_at': '2011-04-14T16:00:49Z',
      },
      {
        'html_url': 'https://github.com/octocat/Hello-World/commit/6dcb09b5b57875f334f61aebed695e2e4193db5e#commitcomment-1',
        'url': 'https://api.github.com/repos/octocat/Hello-World/comments/1',
        'id': 3,
        'node_id': 'MDExOlB1bGxSZXF1ZXN0NDQwMTU0OTI0',
        'body': 'Great stuff',
        'path': 'file1.txt',
        'position': 4,
        'line': 14,
        'commit_id': '6dcb09b5b57875f334f61aebed695e2e4193db5e',
        'user': {
          'login': 'octocat',
          'id': 1,
          'node_id': 'MDQ6VXNlcjE=',
          'avatar_url': 'https://i.pravatar.cc/40',
          'gravatar_id': '',
          'url': 'https://api.github.com/users/octocat',
          'html_url': 'https://github.com/octocat',
          'followers_url': 'https://api.github.com/users/octocat/followers',
          'following_url': 'https://api.github.com/users/octocat/following{/other_user}',
          'gists_url': 'https://api.github.com/users/octocat/gists{/gist_id}',
          'starred_url': 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
          'subscriptions_url': 'https://api.github.com/users/octocat/subscriptions',
          'organizations_url': 'https://api.github.com/users/octocat/orgs',
          'repos_url': 'https://api.github.com/users/octocat/repos',
          'events_url': 'https://api.github.com/users/octocat/events{/privacy}',
          'received_events_url': 'https://api.github.com/users/octocat/received_events',
          'type': 'User',
          'site_admin': false,
        },
        'created_at': '2011-04-14T16:00:49Z',
        'updated_at': '2011-04-14T16:00:49Z',
      },
    ];
  }
}

@Component({
  selector: 'code-review-detail-dialog',
  templateUrl: 'code-review-detail-dialog.html',
})
export class CodeReviewDetailDialog {
  isTrue = false;

  constructor(
    public dialogRef: MatDialogRef<CodeReviewDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmBox(event: MouseEvent) {
    if (event) {
      this.isTrue = true;
    }
  }

  public closePopup(event) {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'code-review-detail-dialog-bestreview',
  templateUrl: 'code-review-detail-dialog-bestreview.html',
})
export class CodeReviewDetailDialogBestreview {
  private dialogConfig = {
    autoFocus: false,
    closeOnNavigation: true,
    direction: 'ltr' as Direction,
    disableClose: false,
    hasBackdrop: true,
    height: '80vh',
    minHeight: '80vh',
    maxHeight: '100%',
    width: '527px',
    maxWidth: '527px',
    panelClass: ['app-dialog'],
    restoreFocus: false,
    role: 'dialog' as DialogRole,
  };
  isTrue: true;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CodeReviewDetailDialogBestreview>) {
  }

  confirmBox() {
    const config: MatDialogConfig = this.dialogConfig;
    config.panelClass = ['app-dialog'];
    this.dialog.open(ExpertEvaluationComponent, config);

  }

  public closePopup() {
    this.dialogRef.close(true);

  }
}

