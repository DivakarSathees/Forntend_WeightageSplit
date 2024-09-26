import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
})
export class JsonViewerComponent {
  loading: boolean = true;
  @Input() jsonData: any;

  constructor() {}

  ngOnInit() {
    this.loading = false;
    console.log(this.jsonData[0]);

  }
}
