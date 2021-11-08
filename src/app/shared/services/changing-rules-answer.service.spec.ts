import { TestBed } from '@angular/core/testing';

import { ChangingRulesAnswerService } from './changing-rules-answer.service';

describe('ChangingRulesAnswerService', () => {
  let service: ChangingRulesAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangingRulesAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
