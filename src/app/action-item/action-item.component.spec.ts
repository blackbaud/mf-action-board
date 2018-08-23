import {VstsPullRequest, VstsRelease} from '../../domain/action-item';

// let unroll = require('unroll');
// unroll.use(it);

// this test probably doesn't work but then again none of them do
// wanted to try and use the unroll helper library here so I don't
// have to have this stupid long second test

// I blame colby...

describe('action items', () => {

  describe('for VstsPullRequest items', () => {
    it('vsts items without tag should not indicate no mergie', () => {
      const pr: any = { repository: {name: 'test'} };
      pr.title = 'happy cat code change';
      const vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeFalsy('There should be no indication of merge restricting');
    });

    it('vsts items with title should indicate not to merge them', () => {
      const pr: any = { repository: {name: 'test'} };
      pr.title = '[do not merge] happy cat code change';
      let vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');

      pr.title = '[do not merge]happy cat code change';
      vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');

      pr.title = '[do NOT merge] happy cat code change';
      vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');

      pr.title = '[Do Not Merge] happy cat code change';
      vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');

      pr.title = '[DO NOT MERGE] happy cat code change';
      vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');
    });

    it('vsts items with tag should indicate not to merge them', () => {
      const pr: any = { repository: {name: 'test'} };
      pr.labels = [{name: 'DO NOT MERGE', active: true}];

      const vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');
    });

    it('vsts items with tag and title should indicate not to merge them', () => {
      const pr: any = { repository: {name: 'test'} };
      pr.labels = [{name: 'DO NOT MERGE', active: true}];
      pr.title = '[do not merge] happy cat code change';

      const vstsItem = new VstsPullRequest(pr);
      expect(vstsItem.do_not_merge).toBeTruthy('There should be an indication of not merging');
    });
  });

  describe('for VstsRelease items', () => {
    describe('building', () => {
      it('should show as needing action if the release failed', () => {
        const releaseInfo: any = { releaseDefinition: {name: 'test release'},
          _links: {web: {href: 'www.test.release'} },
          environments: [{status: 'failed'}] };

        const vstsRelease = new VstsRelease(releaseInfo);
        expect(vstsRelease.building).toBe(false);
      });

      it('should show as building if the release is in progress', () => {
        const releaseInfo: any = { releaseDefinition: {name: 'test release'},
          _links: {web: {href: 'www.test.release'} },
          environments: [{status: 'inProgress'}] };

        const vstsRelease = new VstsRelease(releaseInfo);
        expect(vstsRelease.building).toBe(true);
      });

    });

    describe( 'preDeployApproval', () => {
      it('should show as building if it is in progress and no approval exists', () => {
        const releaseInfo: any = { releaseDefinition: {name: 'test release'},
          _links: {web: {href: 'www.test.release'} },
          environments: [{status: 'inProgress', preDeployApprovals: []}] };

        const vstsRelease = new VstsRelease(releaseInfo);
        expect(vstsRelease.building).toBe(true);
      });

      it('should show as needing action if it is failed and no approval exists', () => {
        const releaseInfo: any = { releaseDefinition: {name: 'test release'},
          _links: {web: {href: 'www.test.release'} },
          environments: [{status: 'failed', preDeployApprovals: []}] };

        const vstsRelease = new VstsRelease(releaseInfo);
        expect(vstsRelease.building).toBe(false);
      });

      it('should show as needing action if approval is needed', () => {
        const releaseInfo: any = { releaseDefinition: {name: 'test release'},
                                    _links: {web: {href: 'www.test.release'} },
                                    environments: [{status: 'inProgress', preDeployApprovals: [{status: 'pending'}]}] };

        const vstsRelease = new VstsRelease(releaseInfo);
        expect(vstsRelease.building).toBe(false);
      });

      it('should show as building action if it is already approved', () => {
        const releaseInfo: any = { releaseDefinition: {name: 'test release'},
          _links: {web: {href: 'www.test.release'} },
          environments: [{status: 'inProgress', preDeployApprovals: [{status: 'approved'}]}] };

        const vstsRelease = new VstsRelease(releaseInfo);
        expect(vstsRelease.building).toBe(true);
      });
    });
  });
});
