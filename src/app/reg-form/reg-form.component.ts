import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
        fName: ['', [Validators.required, this.validateForbiddenFirstName.bind(this)]],
        lName: ['', [Validators.required, Validators.minLength(4)]]
      }, {validator: this.validateNamesLength.bind(this)}),
      email: ['', [Validators.required, Validators.email], [this.validateForbiddenEmail.bind(this)]],
      gender: ['male', [Validators.required]],
      interests: this.fb.array([
        // this.fb.control([''])
      ])
    });

    // subscribe to valueChange event 
    this.regForm.valueChanges.subscribe((value: any) => {
      console.log(value);
    })

    // subscribe to statusChanges event 
    this.regForm.statusChanges.subscribe((status: any) => {
      console.log(status);
    })

    
  }

  get interests(){
    return this.regForm.get('interests') as FormArray;
  }

  onAddInterest(){
    this.interests.push(this.fb.control('', [Validators.required]));
  }

  validateNamesLength(control: FormControl): {[key: string]: boolean} | null {

    let firstNameControl = control.get('fName')
    let lastNameControl = control.get('lName')
    let firstNameLen = firstNameControl?.value ? firstNameControl.value.length : 0;
    let lastNameLen = lastNameControl?.value ? lastNameControl.value.length : 0;
    if(firstNameLen>=lastNameLen) return null;
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
    while(this.interests.length) this.interests.clear();
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
