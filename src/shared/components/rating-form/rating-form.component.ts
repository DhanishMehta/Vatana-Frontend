import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rating-form',
  templateUrl: './rating-form.component.html',
  styleUrls: ['./rating-form.component.scss'],
})
export class RatingFormComponent implements OnInit {
  ratingForm: FormGroup;
  @Output() rating: EventEmitter<string> = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ratingForm = this.fb.group({
      stars: this.fb.control(''),
    });

    this.ratingForm.get('stars').valueChanges.subscribe({
      next: (val) => {
        this.handleEmit(val);
      },
    });
  }

  handleEmit(val: string) {
    this.rating.emit(val);
  }
}
