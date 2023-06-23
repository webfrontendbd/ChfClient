import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-coreui',
  templateUrl: './coreui.component.html',
  styleUrls: ['./coreui.component.css']
})
export class CoreuiComponent implements OnInit {
  title = 'acWebClient';
  @HostBinding('class') class='sidebar-mini';
  
  constructor(private renderer:Renderer2){}

  ngOnInit(): void {
    this.renderer.removeClass(document.querySelector('body'), 'login-page');
    this.renderer.addClass(document.querySelector('body'), 'sidebar-mini');
    this.renderer.addClass(document.querySelector('body'), 'sidebar-collapse');
    
  }

}