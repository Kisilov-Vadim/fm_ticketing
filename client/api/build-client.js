import axios from "axios";

export const buildClient = ({req}) => {
  if (typeof window === 'undefined') {
    return axios.create({
      headers: req.headers,
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    });
  } else {
    return axios.create({baseURL: '/'});
  }
}