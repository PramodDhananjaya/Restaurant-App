import { Component, OnInit , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish : Dish;
  promotion : Promotion;
  leader: Leader;
  dishErrMsg: string;

  baseURL = environment.baseURL;

  constructor(private dishService : DishService, private promotionService : PromotionService,private leaderService: LeaderService, private router: Router
   ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
    .subscribe(dish => this.dish = dish, errmsg => this.dishErrMsg = <any>errmsg);
    this.promotionService.getFeaturedPromotion()
    .subscribe(promotion => this.promotion = promotion);
    this.leaderService.getFeaturedLeader()
    .subscribe(leader => this.leader= leader);

    this.router.events.subscribe((evt) => {
        if(!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0,0);
    });
  }

}
