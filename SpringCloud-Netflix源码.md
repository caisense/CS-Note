# RibbonClientConfiguration

非常重要的Ribbon配置类，在第一个发起Ribbon请求的时候会完成对应的初始化操作。会完成多个相关的默认设置。

| 接口                 | 默认实现                     | 描述                 |
| :------------------- | :--------------------------- | :------------------- |
| IClientConfig        | DefaultClientConfigImpl      | 管理配置接口         |
| IRule                | ZoneAvoidanceRule            | 均衡策略接口         |
| IPing                | DummyPing                    | 检查服务可用性接口   |
| `ServerList<Server>` | ConfigurationBasedServerList | 获取服务列表接口     |
| ILoadBalancer        | **ZoneAwareLoadBalancer**    | **负载均衡接口**     |
| ServerListUpdater    | PollingServerListUpdater     | 定时更新服务列表接口 |
| ServerIntrospector   | DefaultServerIntrospector    | 安全端口接口         |



## ZoneAwareLoadBalancer

最常用的负载均衡接口实现类。继承关系：

<img src="images/SpringCloud-Netflix源码/image-20230725012441729.png" alt="image-20230725012441729" style="zoom: 67%;" />

其父类DynamicServerListLoadBalancer的 `enableAndInitLearnNewServersFeature`方法，实现了拉取最新服务的逻辑

```java
public void enableAndInitLearnNewServersFeature() {
    LOGGER.info("Using serverListUpdater {}", serverListUpdater.getClass().getSimpleName());
    serverListUpdater.start(updateAction);
}
```

其中serverListUpdater是类成员：

```java
public class DynamicServerListLoadBalancer<T extends Server> extends BaseLoadBalancer {
    private static final Logger LOGGER = LoggerFactory.getLogger(DynamicServerListLoadBalancer.class);

    boolean isSecure = false;
    boolean useTunnel = false;

    // to keep track of modification of server lists
    protected AtomicBoolean serverListUpdateInProgress = new AtomicBoolean(false);

    volatile ServerList<T> serverListImpl;

    volatile ServerListFilter<T> filter;

    protected final ServerListUpdater.UpdateAction updateAction = new ServerListUpdater.UpdateAction() {
        @Override
        public void doUpdate() {
            updateListOfServers();
        }
    };

    protected volatile ServerListUpdater serverListUpdater;
}
```

> 多说一句，serverListUpdater同样是在 RibbonClientConfiguration 这个配置类中自动配置的
>
> ```java
> @Bean
> @ConditionalOnMissingBean
> public ServerListUpdater ribbonServerListUpdater(IClientConfig config) {
>     return new PollingServerListUpdater(config);
> }
> ```

接口ServerListUpdater唯一的实现类**PollingServerListUpdater**中实现了start方法：

```java
@Override
public synchronized void start(final UpdateAction updateAction) {
    if (isActive.compareAndSet(false, true)) {
        final Runnable wrapperRunnable = new Runnable() {
            @Override
            public void run() {
                if (!isActive.get()) {
                    if (scheduledFuture != null) {
                        scheduledFuture.cancel(true);
                    }
                    return;
                }
                try {
                    updateAction.doUpdate();
                    lastUpdated = System.currentTimeMillis();
                } catch (Exception e) {
                    logger.warn("Failed one update cycle", e);
                }
            }
        };

        scheduledFuture = getRefreshExecutor().scheduleWithFixedDelay(
            wrapperRunnable,
            initialDelayMs,
            refreshIntervalMs,
            TimeUnit.MILLISECONDS
        );
    } else {
        logger.info("Already active, no-op");
    }
}
```

