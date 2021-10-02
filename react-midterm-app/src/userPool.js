import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-west-1_ZsbweWHPp",
    ClientId: "3nogkbep8jdejlpblk2mn5e3k2"
}

export default new CognitoUserPool(poolData);