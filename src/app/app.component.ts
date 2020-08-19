import {Component, OnInit} from '@angular/core';
import {DynamicFormBuildConfig, DynamicFormConfiguration, FormControlConfig, RxDynamicFormBuilder} from '@rxweb/reactive-dynamic-forms';

export const SERVER_DATA = [
  {
    type: 'text',
    name: 'firstName',
    validators: {
      required: true
    },
    ui: {
      label: 'First Name',
      placeholder: 'Enter Your First Name'
    }
  },
  {
    type: 'select',
    name: 'country',
    ui: {
      label: 'Country',
      placeholder: 'Select...'
    },
    validators: {
      required: true
    },
    source: [
      {
        value: 1,
        text: 'Maurice'
      },
      {
        value: 2,
        text: 'MADA'
      },
      {
        value: 1,
        text: 'RODRIGUES'
      }
    ]
  },
  {
    type: 'select',
    name: 'state',
    validators: {
      required: { conditionalExpression: 'x => x.country != undefined && x.country != null' }
    },
    ui: {
      label: 'State',
      placeholder: 'Select...'
    },
    modelName: 'state',
    filter: [
      {
        value: 1,
        text: 'PORT LOUIS',
        countryId: 1
      },
      {
        value: 2,
        text: 'TANA',
        countryId: 2
      },
      {
        value: 3,
        text: 'PORT MATHURIN',
        countryId: 3
      },
      {
        value: 4,
        text: 'SAVANNE',
        countryId: 1
      }
    ]
  },
  {
    type: 'textarea',
    name: 'permanentAddress',
    ui: {
      label: 'Permanent Address',
      placeholder: 'Enter Your Permanent Address'
    }
  },
  {
    type: 'checkbox',
    name: 'sameAsPermanent',
    modelName: 'sameAsAddress',
    source: [
      {
        value: 1,
        text: 'Same As Permanent'
      }
    ]
  },
  {
    type: 'textarea',
    name: 'correspondenceAddress',
    ui: {
      label: 'Correspondence Address',
      placeholder: 'Enter Your Correspondence Address'
    }
  }
];

export class SameAsAddressModel extends FormControlConfig {
  hooks = {
    postValue: () => {
      if (this.value) {
        this.controlsConfig.correspondenceAddress.value = this.controlsConfig.permanentAddress.value;
      } else {
        this.controlsConfig.correspondenceAddress.value = null;
      }
    }
  };
}

export class StateModel extends FormControlConfig {
  // tslint:disable-next-line:variable-name
  private _filter: any[];

  set filter(value: any[]) {
    this._filter  = value;
  }

  get filter() {
    return this._filter.filter(t => t.countryId == this.controlsConfig.country.value);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rxform';

  serverData: any[] = SERVER_DATA;

  dynamicForm: DynamicFormBuildConfig;

  dynamicFormConfiguration: DynamicFormConfiguration;
  constructor(private dynamicFormBuilder: RxDynamicFormBuilder) {}

  uiBindings: string[] = ['firstName', 'country', 'state', 'permanentAddress', 'sameAsPermanent', 'correspondenceAddress'];

  ngOnInit(): void {
    this.dynamicFormConfiguration = {
      controlConfigModels: [{modelName: 'state', model: StateModel}, {modelName: 'sameAsAddress', model: SameAsAddressModel}]
    };

    this.dynamicForm = this.dynamicFormBuilder.formGroup(this.serverData, this.dynamicFormConfiguration);

  }

  submit() {
    console.log(this.dynamicForm.formGroup.value, 'value');
  }
}
