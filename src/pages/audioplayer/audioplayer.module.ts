import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudioplayerPage } from './audioplayer';
import {WebAudioProvider, /*CordovaMediaProvider, defaultAudioProviderFactory*/} from '../../components/audio-player/ionic-audio-providers'
import { IonicAudioModule } from '../../components/audio-player/ionic-audio.module';

export function myCustomAudioProviderFactory() {
  return /*(window.hasOwnProperty('cordova')) ? new CordovaMediaProvider() : */new WebAudioProvider();
}

@NgModule({
  declarations: [
    AudioplayerPage,
  ],
  imports: [
    IonicAudioModule.forRoot(myCustomAudioProviderFactory), 
    IonicPageModule.forChild(AudioplayerPage),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AudioplayerPageModule {}
