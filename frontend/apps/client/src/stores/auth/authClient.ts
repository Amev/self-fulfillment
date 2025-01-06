/* eslint-disable import/prefer-default-export */
import Request from 'libs/requests';

export async function postSignOut() {
  return (await Request.post('/users/logout/', {})).data;
}
