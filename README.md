# Interpretation editor

## Maintainers information

Building and deployment of the appication is done using a gitlab-runner. We first build a docker container and store it in the gitlab project container registry. Then we push changes to the cluster environment which picks up the container from the registry and starts serving it.

## Building the container

The container can be built using a gitlab-runner (to be set up). The runner can run `Kaniko`. This can be emulated/tested on a local machine as such

```shell
docker run -ti --rm --entrypoint="" \
  -v $HOME/.docker/config.json:/kaniko/.docker/config.json  \
  -v $PWD:/workspace gcr.io/kaniko-project/executor:v1.9.1-debug \
  /kaniko/executor \
    --context gui \
    --dockerfile gui/Dockerfile \
    --destination ci.tno.nl/calculemus/ui/interpretation-editor:test
```

## Deployment

For deployment we need to link the gitlab project and the kubernetes cluster. Deploy tokens need to be added to Kubernetes to pull images and service account tokens need to be added to the project to allow it to push changes to the cluster.

Deploy tokens can be set up at https://ci.tno.nl/gitlab/ds/lab/-/settings/repository and CI/CD Variables can be configured at https://ci.tno.nl/gitlab/calculemus/ui/interpretation-editor/-/settings/ci_cd.

Given a deploy token named `gitlab-k8s-deploy` and password `XXX`, it should be added to kubernetes as `kubectl -n create secret docker-registry gitlab-k8s-deploy --docker-server=ci.tno.nl --docker-username=gitlab-k8s-deploy --docker-password="XXX"`.
d
and can be used to allow images in Kubernetes to be downloaded, such as described in the [docs](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)d, e.g. by setting it under `pod.spec.imagePullSecrets`.

Likewise, a service account (user) should be added to kubernetes that allows creation of deployments.

```shell
kubectl create serviceaccount gitlab-deploy
kubectl create token gitlab-deploy
```

The output of the latter should be stored as a CI/CD token in Gitlab, e.g. as `K8S_TOKEN` and can be used in a deploy script to authenticate to the server (currently at `https://api.k8s.tnods.nl`).
