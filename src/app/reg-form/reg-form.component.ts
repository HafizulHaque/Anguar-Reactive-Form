import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.css']
})
export class RegFormComponent implements OnInit {

  regForm : any;

  suggestedName : any = {first: 'Rene', last: 'Dekarte'};
  forbiddenFirstNames: string[] = ['nemo', 'anna'];
  forbiddenEmail: string = 'nemo@nobody.com';
  genders: string[] = ['male', 'female'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.regForm = this.fb.group({
      name : this.fb.group({
        fName: ['', [Validators.required, this.validateForbiddenFirstName.bind(this), this.validateFirstNameGreaterThanLastName.bind(this)]],
        lName: ['', [Validators.required]]
      }),
      email: ['', [Validators.required, Validators.email], [this.validateForbiddenEmail.bind(this)]],
      gender: ['male', [Validators.required]],
      interests: this.fb.array([
        // this.fb.control([''])
      ])
    })
  }

  get interests(){
    return this.regForm.get('interests') as FormArray;
  }

  onAddInterest(){
    this.interests.push(this.fb.control('', [Validators.required]));
  }

  validateFirstNameGreaterThanLastName(control: FormControl): {[key: string]: boolean} | null {

    let lastNameControl = this.regForm?.get('name.lName')
    let lastNameLen = lastNameControl ? lastNameControl.value.length : 0;
    let firstNameLen = control ? control.value.length : 0;
    if(firstNameLen>lastNameLen) return null;
    else return {'firstNameLengthError': true};
  }

  validateForbiddenFirstName(control: FormControl): {[key: string]: boolean} | null {
    if(this.forbiddenFirstNames.indexOf(control.value) !== -1){
      return {'forbiddenFirstName': true};
    }
    return null;
  }

  validateForbiddenEmail(control: FormControl): Observable<any> | Promise<any> {
    const promise = new Promise((resolve, reject)=>{
      if(control.value===this.forbiddenEmail){
        setTimeout(()=>{
          resolve({'forbiddenEmail': true});
        }, 1500);
      }else{
        resolve(null);
      }
    })
    return promise;
  }

  onSubmit(){
    console.log(this.regForm);
  }

  onClear(){
    this.regForm.reset();
  }

  onSuggestUserName(){
    this.regForm.patchValue({
      name: {
        fName: this.suggestedName.first,
        lName: this.suggestedName.last
      }
    })
  }

}
