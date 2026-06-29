import { Component } from '@angular/core';
import { Modal } from '../../components/modal/modal';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { MobileHeader } from '../mobile-header/mobile-header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout-main',
  imports: [RouterOutlet, Modal, Header, MobileHeader, Sidebar],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.scss',
})
export class LayoutMain {}
