import React, { PureComponent } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import moment from 'moment-timezone';
import { Tooltip } from '../index';
import './index.css';

class CertificateInfo extends PureComponent {
  static getInfos = (csrInfo, certInfo) => {
    let info = {};
    let title;
    if (certInfo && !isEqual(certInfo, {})) {
      info = certInfo;
      title = 'Certificate Info';
    } else if (csrInfo && !isEqual(csrInfo, {})) {
      info = csrInfo;
      title = 'CSR Info';
    }

    const stripUnavailableInfos = source => {
      return Object.keys(source).reduce(
        (prev, attr) => ({
          ...prev,
          [attr]: {
            ...source[attr],
            value: isNil(source[attr].value) ? '-' : source[attr].value,
          },
        }),
        {}
      );
    };

    const toReadableDate = timestamp =>
      moment(timestamp)
        .tz(moment.tz.guess())
        .format('lll z');

    const dates = {
      notAfter: get(info, 'notAfter'),
      notBefore: get(info, 'notBefore'),
    };

    const parsedInfo = {
      subject: {
        commonName: { label: 'Common Name', value: get(info, 'subject.CN') },
        country: { label: 'Country Code', value: get(info, 'subject.C') },
        locality: { label: 'Locality', value: get(info, 'subject.L') },
        organization: { label: 'Organization Name', value: get(info, 'subject.O') },
        organizationUnit: { label: 'Organization Unit Name', value: get(info, 'subject.OU') },
        state: { label: 'State', value: get(info, 'subject.S') },
      },
      issuer: {
        commonName: { label: 'Common Name', value: get(info, 'issuer.CN') },
        country: { label: 'Country Code', value: get(info, 'issuer.C') },
        locality: { label: 'Locality', value: get(info, 'issuer.L') },
        organization: { label: 'Organization Name', value: get(info, 'issuer.O') },
        organizationUnit: { label: 'Organization Unit Name', value: get(info, 'issuer.OU') },
        state: { label: 'State', value: get(info, 'issuer.S') },
      },
      dates: {
        notAfter: {
          label: 'Not After',
          value: dates.notAfter ? toReadableDate(dates.notAfter) : null,
        },
        notBefore: {
          label: 'Not Before',
          value: dates.notBefore ? toReadableDate(dates.notBefore) : null,
        },
      },
    };
    return {
      title,
      subject: stripUnavailableInfos(parsedInfo.subject),
      issuer: stripUnavailableInfos(parsedInfo.issuer),
      dates: stripUnavailableInfos(parsedInfo.dates),
    };
  };

  constructor(props) {
    super(props);
    this.showDetailedInfoModal = this.showDetailedInfoModal.bind(this);
  }
  showDetailedInfoModal() {}

  render() {
    const infos = CertificateInfo.getInfos(this.props.csrInfo, this.props.certInfo);
    if (!infos.title) {
      return null;
    }

    return (
      <div className="certificate-info">
        <div className="certificate-info__container">
          <div className="certificate-info__title">{infos.title}</div>
          {/*
            TODO
            Add details modal - https://modusbox.atlassian.net/browse/BOX-110
            <a role="presentation" href="" className="certificate-info__detail-button">View all details</a>
          */}

          <div className="certificate-info__dates">
            <InfoItem info={infos.dates.notBefore} />
            <InfoItem info={infos.dates.notAfter} />
          </div>

          <InfoBlock label="Subject">
            <InfoItem info={infos.subject.commonName} />
            <InfoItem info={infos.subject.organization} />
            <InfoItem info={infos.subject.organizationUnit} />
            <InfoItem info={infos.subject.country} />
          </InfoBlock>
          <InfoBlock label="Issuer">
            <InfoItem info={infos.issuer.commonName} />
            <InfoItem info={infos.issuer.organization} />
            <InfoItem info={infos.issuer.organizationUnit} />
            <InfoItem info={infos.issuer.country} />
          </InfoBlock>
        </div>
      </div>
    );
  }
}

const InfoBlock = ({ label, children }) => (
  <div className="certificate-info__block">
    <div className="certificate-info__block__title">
      <div className="certificate-info__block__label">{label}</div>
      <div className="certificate-info__block__liner" />
    </div>
    <div className="certificate-info__block__content">{children}</div>
  </div>
);

const InfoItem = ({ info }) => {
  if (!info || !info.value) {
    return null;
  }
  return (
    <div className="certificate-info__item">
      <div className="certificate-info__item__label">{info.label}</div>
      <Tooltip className="certificate-info__item__value">
        <span>{info.value}</span>
      </Tooltip>
    </div>
  );
};

export default CertificateInfo;
