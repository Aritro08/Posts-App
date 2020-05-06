import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsChangedSubs: Subscription;
  authStatusSub: Subscription;
  isAuthenticated = false;
  isLoading = false;
  userId: string;
  totalPosts = 0;
  postPerPage = 3;
  curPage = 1;
  postOptions = [2,3,4,6];


  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.curPage);
    this.userId = this.authService.getUserId();
    this.postsChangedSubs = this.postService.postChanged.subscribe(postData => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatus().subscribe(status => {
      this.isAuthenticated = status;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(resData => {
      this.isLoading = false;
      this.postService.getPosts(this.postPerPage, this.curPage)
    });
  }

  onPageChange(event: PageEvent) {
    this.isLoading = true;
    this.curPage = event.pageIndex+1;
    this.postPerPage = event.pageSize;
    this.postService.getPosts(this.postPerPage, this.curPage);
  }

  ngOnDestroy() {
    this.postsChangedSubs.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
