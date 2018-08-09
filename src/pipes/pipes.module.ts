import { NgModule } from '@angular/core';
import { FirstCapsPipe } from './first-caps/first-caps';
@NgModule({
	declarations: [FirstCapsPipe],
	imports: [],
	exports: [FirstCapsPipe]
})
export class PipesModule {}
