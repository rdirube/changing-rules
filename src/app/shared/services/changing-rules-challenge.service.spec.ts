import { TestBed } from '@angular/core/testing';

import { ChangingRulesChallengeService } from './changing-rules-challenge.service';

describe('ChangingRulesChallengeService', () => {
  let service: ChangingRulesChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangingRulesChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
