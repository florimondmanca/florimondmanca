import { Component, OnInit } from '@angular/core';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faGithub, faTwitter, faDev } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  faLinkedin = faLinkedinIn;
  faGitHub = faGithub;
  faTwitter = faTwitter;
  faRss = faRss;
  faDev = faDev;

  now: Date;

  ngOnInit() {
    this.now = new Date();
  }

}
