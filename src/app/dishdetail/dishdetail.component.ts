import { Component, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish'
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder , FormGroup , Validators } from '@angular/forms'
import { Comment } from '../shared/comment';
import { DISHES} from '../shared/dishes';
import { environment } from '../../environments/environment';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility',[
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds : string[] = [];
  prev: string;
  next: string;
  baseURL = environment.baseURL;
  errMsg : string;
  dishCopy: Dish;

  commentForm : FormGroup;
  comment: Comment;
  @ViewChild('cform') commentFormDirective;
  visibility = 'shown';

  formErrors = {
    'rating' : '',
    'comment' : '',
    'author' : ''
  }

  validationMessages = {
    'rating' : {
      'required' : 'Rating is required'
    },
    'comment' : {
      'required' : 'Comment is required'
    },
    'author' : {
    'required' : 'Author name is required',
    'minlength' : 'Author name must at least 2 characters'
    }
  }

  constructor(private dishService: DishService, private route: ActivatedRoute, private location: Location, private fb:FormBuilder) {
    this.createCommentForm();
   }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,errmsg => this.errMsg=<any>errmsg);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(params['id']);})).
    subscribe(dish => {this.dish=dish; this.setPrevNext(dish.id); this.visibility='shown'; this.dishCopy=dish}, errmsg => this.errMsg = <any>errmsg);

  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length+ index +1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
  createCommentForm(){
    this.commentForm = this.fb.group({
      rating:['5',Validators.required],
      comment: ['',Validators.required],
      author:['',[Validators.required,Validators.minLength(2)]],
      date: ''
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if(!this.commentForm) { return; }
    const form = this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)) {
        //clear previous error message
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  onSubmit(){
      this.comment = this.commentForm.value;
      this.comment.date = new Date().toISOString();
      this.dishCopy.comments.push(this.comment);
      this.dishService.putDish(this.dishCopy)
      .subscribe(dish => {
        this.dish = dish; this.dishCopy= dish
      },
      errMsg => {
        this.dish = null; this.dishCopy = null; this.errMsg = <any>errMsg;
      });
      this.commentForm.reset({
        rating: 5,
        comment: '',
        author: '',
        date: ''
      });
      this.commentFormDirective.resetForm();

  }


}
