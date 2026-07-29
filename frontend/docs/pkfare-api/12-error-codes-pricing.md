# Error Codes - Pricing API

| erroCode | erroMsg                                                                        | Description                                                                                                  |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 0        | ok                                                                             | Request has been processed successfully.                                                                     |
| S001     | System error.                                                                  | System error.                                                                                                |
| B002     | Partner does not exists.                                                       | PartnerID does not exist.                                                                                    |
| B003     | Illegal sign.                                                                  | Illegal sign. Please check your signature.                                                                   |
| B035     | Concurrency limited. Please contact PKFARE API support team for assistant.     | Concurrency exceeded system limits.                                                                          |
| P001     | XXX is illegal.                                                                | The field of XXX is illegal.                                                                                 |
| P002     | XXX is missing.                                                                | The field of XXX is missing.                                                                                 |
| P004     | The maximum number of passengers with seat is 9.                               | Wrong parameter. The maximum number of passengers with seat is 9.                                            |
| P005     | There should be at least one adult.                                            | Wrong parameter. There should be at least one adult.                                                         |
| P009     | The number of infant passengers can not exceed the number of adult passengers. | Wrong parameter. The number of infant passengers can not exceed the number of adult passengers.              |
| B013     | Interface is limited, please contact the system administrator.                 | The route that you request is limited, please contact system administrator.                                  |
| B015     | Pricing failed.                                                                | Pricing failed for other reason.                                                                             |
| B016     | Flight near take-off, can't offer pricing service.                             | Pricing fail. Can not pricing for flights that is near taking off.                                           | 