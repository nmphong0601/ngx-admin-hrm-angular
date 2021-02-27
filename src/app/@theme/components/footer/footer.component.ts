import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Modified with ♥ by <b><a href="https://facebook.com/Zin.Kick" target="_blank">NMP</a></b> 2021
    </span>
  `,
})
export class FooterComponent {
}
