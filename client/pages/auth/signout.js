import React, {useEffect} from 'react';
import Router from 'next/router';

import {useRequest} from '../../hooks'

const Signout = () => {
  const {doRequest} = useRequest({
    body: {},
    method: 'post',
    url: '/api/users/signout',
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  })

  return (
    <div>
      Signing you out...
    </div>
  )
}

export default Signout;