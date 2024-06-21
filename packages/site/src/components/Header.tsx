import React, { useContext } from 'react';
import semver from 'semver';
import styled from 'styled-components';
import packageInfo from '../../package.json';
import Logo from '../assets/boba-logo.png';
import { defaultSnapOrigin, snapPackageInfoVersion } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap } from '../utils';
import { HeaderButtons } from './Buttons';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: ${({ theme }) => theme.shadows.button};
  background-color: ${({ theme }) => theme.colors.background?.alternative};
`;

const BobaLogo = styled.img`
  width: 50px;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const VersionStyle = styled.p`
  margin-top: 1.2rem;
  font-size: 1.6rem;
  margin: auto;
  padding-right: 2rem;
  color: ${({ theme }) => theme.colors.text?.muted};
`;

export const Header = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const updateAvailable = Boolean(
    state?.installedSnap &&
    semver.gt(snapPackageInfoVersion, state.installedSnap?.version),
  );

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  /**
   * Component that displays the dapp and snap versions.
   *
   * @returns A component that displays the dapp and snap versions.
   */
  const Version = () => {
    return (
      <VersionStyle>
        <div>
          <span>Snap version (expected): </span>
          {snapPackageInfoVersion}
        </div>

        {state.installedSnap ? (
          <div>
            <span>Snap version (installed): </span> {state.installedSnap?.version}
          </div>
        ) : (
          <div>
              <span>Snap version (to install): </span> {snapPackageInfoVersion}
          </div>
        )}

        {defaultSnapOrigin.startsWith('local') && `(from ${defaultSnapOrigin})`}
      </VersionStyle>
    );
  };

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <BobaLogo src={Logo} />
        <Title>AA HC Wallet</Title>
      </LogoWrapper>
      <RightContainer>
        <Version />
        <HeaderButtons
          state={state}
          onConnectClick={handleConnectClick}
          updateAvailable={updateAvailable}
        />
      </RightContainer>
    </HeaderWrapper>
  );
};
