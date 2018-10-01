import { Component, Input } from '@angular/core';
import { ScrollService } from 'app/core';
import { Post } from 'app/blogging-core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {

  @Input() posts: Post[] = [];
  @Input() action = '';
  @Input() ifEmpty = 'No blog posts here yet. Stay tuned!';

  constructor(private scroll: ScrollService) { }

  scrollTop() {
    this.scroll.toTop();
  }

  getLink(post: Post): string[] {
    if (this.action === 'edit') {
      return ['/a/', post.slug, 'edit'];
    } else {
      return ['/', post.slug];
    }
  }

}