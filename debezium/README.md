# Debezium

[https://github.com/debezium/debezium-examples/tree/master/tutorial#using-postgres](https://github.com/debezium/debezium-examples/tree/master/tutorial#using-postgres)
[https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/](https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/)

```
docker-compose -f docker-compose.yml exec kafka /kafka/bin/kafka-console-consumer.sh \
 --bootstrap-server kafka:9092 \
 --from-beginning \
 --property print.key=true \
 --topic reviewty.reviewtydev.real_review
```

```
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" http://localhost:8083/connectors/ -d @register-postgres.json
```

- Delete a connector from Kafka Connect
  [https://rmoff.net/2019/05/22/deleting-a-connector-in-kafka-connect-without-the-rest-api/](https://rmoff.net/2019/05/22/deleting-a-connector-in-kafka-connect-without-the-rest-api/)

- Update a connector from Kafka Connect
