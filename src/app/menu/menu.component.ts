import { Component, OnInit} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service'
import { environment} from '../../environments/environment';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  baseURL = environment.baseURL;
  errMsg : string;


  constructor(private dishService: DishService
   ) { }

  ngOnInit(): void {
    this.dishService.getDishes().
    subscribe(dishes => this.dishes = dishes, errmsg => this.errMsg = <any> errmsg);
  }



}
