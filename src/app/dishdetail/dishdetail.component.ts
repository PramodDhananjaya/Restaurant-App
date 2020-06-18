import { Component, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish'
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder , FormGroup , Validators } from '@angular/forms'
import { Comment } from '../shared/comment';
import { DISHES} from '../shared/dishes';
import { validateBasis } from '@angular/flex-layout';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds : string[] = [];
  prev: string;
  next: string;

  commentForm : FormGroup;
  comment: Comment;
  @ViewChild('cform') commentFormDirective;

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
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id']))).
    subscribe(dish => {this.dish=dish; this.setPrevNext(dish.id)});

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
      const date = new Date();
      this.commentForm.controls['date'].setValue(date.toISOString());
      this.comment = this.commentForm.value;
      const arr = DISHES;
      arr[this.dish.id].comments.push(this.comment);
      this.commentForm.reset({
        rating: '5',
        comment: '',
        author: '',
        date: ''
      });
      this.commentFormDirective.resetForm();

  }


}
