FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/nginx.template

CMD sh -c "envsubst < /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"